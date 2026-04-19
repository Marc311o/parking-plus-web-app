package com.parkingplus.auth

import com.parkingplus.email.EmailService
import com.parkingplus.users.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

@Service
class PasswordResetService(
    private val userRepository: UserRepository,
    private val tokenRepository: PasswordResetTokenRepository,
    private val passwordEncoder: PasswordEncoder,
    private val emailService: EmailService
) {

    @Transactional
    fun createTokenAndSendEmail(email: String) {
        val user = userRepository.findByEmail(email).orElse(null) ?: return

        tokenRepository.deleteByUser_Id(user.id!!)

        val token = UUID.randomUUID().toString()
        val expiryDate = Instant.now().plus(15, ChronoUnit.MINUTES)

        val resetToken = PasswordResetTokenEntity(
            token = token,
            user = user,
            expiryDate = expiryDate
        )
        tokenRepository.save(resetToken)

        val resetLink = "http://localhost:5173/reset-password?token=$token"

        emailService.sendPasswordResetEmail(user.email, resetLink)
    }

    @Transactional
    fun resetPassword(request: ResetPasswordRequest): Boolean {
        val resetToken = tokenRepository.findByToken(request.token) ?: return false

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