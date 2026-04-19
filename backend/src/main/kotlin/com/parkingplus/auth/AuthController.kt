package com.parkingplus.auth

import com.parkingplus.security.JwtService
import com.parkingplus.security.TwoFactorAuthService
import com.parkingplus.users.UserRepository
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
    private val tfaService: TwoFactorAuthService,
    private val passwordResetService: PasswordResetService
) {

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<Any> {
        val user = userRepository.findByEmail(request.email).orElse(null)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nieprawidłowy email lub hasło")

        if (!passwordEncoder.matches(request.password, user.password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nieprawidłowy email lub hasło")
        }

        if (user.isMfaEnabled) {
            return ResponseEntity.ok(LoginResponse(
                mfaRequired = true,
                email = user.email
            ))
        }

        val token = jwtService.generateToken(user)
        return ResponseEntity.ok(LoginResponse(token = token))
    }

    @PostMapping("/verify-mfa")
    fun verifyMfa(@RequestBody request: MfaVerificationRequest): ResponseEntity<Any> {
        val user = userRepository.findByEmail(request.email).orElse(null)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Użytkownik nie istnieje")

        val secret = user.mfaSecret
            ?: return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("2FA nie jest skonfigurowane")

        if (!tfaService.isCodeValid(secret, request.code)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Niepoprawny kod 2FA")
        }

        val token = jwtService.generateToken(user)
        return ResponseEntity.ok(LoginResponse(token = token))
    }

    @PostMapping("/forgot-password")
    fun forgotPassword(@RequestBody request: ForgotPasswordRequest): ResponseEntity<String> {
        passwordResetService.createTokenAndSendEmail(request.email)
        return ResponseEntity.ok("Jeśli e-mail istnieje w bazie, wysłano na niego link do resetu hasła.")
    }

    @PostMapping("/reset-password")
    fun resetPassword(@RequestBody request: ResetPasswordRequest): ResponseEntity<String> {
        val success = passwordResetService.resetPassword(request)
        return if (success) {
            ResponseEntity.ok("Hasło zostało pomyślnie zmienione.")
        } else {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nieprawidłowy lub wygasły token.")
        }
    }
}
