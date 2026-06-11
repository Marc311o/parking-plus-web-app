package com.parkingplus.auth

import com.parkingplus.email.EmailService
import com.parkingplus.users.UserRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.security.MessageDigest
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

@Service
class PasswordResetService(
    private val userRepository: UserRepository,
    private val tokenRepository: PasswordResetTokenRepository,
    private val passwordEncoder: PasswordEncoder,
    private val emailService: EmailService,
    @Value("\${app.frontendBaseUrl:http://localhost:5173}") private val frontendBaseUrl: String
) {

    private fun hashToken(rawToken: String): String {
        val digest = MessageDigest.getInstance("SHA-256")
        return digest.digest(rawToken.toByteArray()).joinToString("") { "%02x".format(it) }
    }

    @Transactional
    fun createTokenAndSendEmail(email: String) {
        val user = userRepository.findByEmail(email).orElse(null) ?: return

        tokenRepository.deleteByUser_Id(user.id!!)

        val rawToken = UUID.randomUUID().toString()
        val hashedToken = hashToken(rawToken)
        val expiryDate = Instant.now().plus(15, ChronoUnit.MINUTES)

        val resetToken = PasswordResetTokenEntity(
            token = hashedToken,
            user = user,
            expiryDate = expiryDate
        )
        tokenRepository.save(resetToken)

        val resetLink = "$frontendBaseUrl/reset-password?token=$rawToken"

        emailService.sendPasswordResetEmail(user.email, resetLink)
    }

    @Transactional
    fun resetPassword(request: ResetPasswordRequest): Boolean {
        val hashedToken = hashToken(request.token)
        val resetToken = tokenRepository.findByToken(hashedToken) ?: return false

        if (resetToken.expiryDate.isBefore(Instant.now())) {
            tokenRepository.delete(resetToken)
            return false
        }

        val user = resetToken.user
        user.password = passwordEncoder.encode(request.newPassword)
        userRepository.save(user)

        tokenRepository.delete(resetToken)
        return true
    }
}
