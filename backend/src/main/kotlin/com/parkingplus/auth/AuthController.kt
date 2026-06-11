package com.parkingplus.auth

import com.parkingplus.security.JwtService
import com.parkingplus.security.TwoFactorAuthService
import com.parkingplus.users.UserDTO
import com.parkingplus.users.UserRepository
import com.parkingplus.users.UserService
import com.parkingplus.users.requests.CreateUserRequest
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpointy do logowania, rejestracji i resetowania hasła")
class AuthController(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
    private val tfaService: TwoFactorAuthService,
    private val passwordResetService: PasswordResetService,
    private val userService: UserService
) {

    companion object {
        private const val INVALID_CREDENTIALS_MSG = "Nieprawidłowy email lub hasło"
    }

    @Operation(summary = "Logowanie użytkownika", description = "Zwraca token JWT lub preAuthToken jeśli MFA jest włączone.")
    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<Any> {
        val user = userRepository.findByEmail(request.email).orElse(null)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(INVALID_CREDENTIALS_MSG)

        if (!passwordEncoder.matches(request.password, user.password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(INVALID_CREDENTIALS_MSG)
        }

        if (user.isMfaEnabled) {
            return ResponseEntity.ok(
                LoginResponse(
                    mfaRequired = true,
                    preAuthToken = jwtService.generatePreAuthToken(user)
                )
            )
        }

        val token = jwtService.generateToken(user)
        return ResponseEntity.ok(LoginResponse(token = token))
    }

    @Operation(summary = "Weryfikacja kodu MFA", description = "Weryfikuje kod TOTP i zwraca ostateczny token JWT.")
    @PostMapping("/verify-mfa")
    fun verifyMfa(@RequestBody request: MfaVerificationRequest): ResponseEntity<Any> {
        val email = jwtService.validatePreAuthToken(request.preAuthToken)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(INVALID_CREDENTIALS_MSG)

        val user = userRepository.findByEmail(email).orElse(null)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(INVALID_CREDENTIALS_MSG)

        val secret = user.mfaSecret
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(INVALID_CREDENTIALS_MSG)

        if (!tfaService.isCodeValid(secret, request.code)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Niepoprawny kod 2FA")
        }

        val token = jwtService.generateToken(user)
        return ResponseEntity.ok(LoginResponse(token = token))
    }

    @Operation(summary = "Zapomniane hasło", description = "Wysyła link do resetu hasła na podany adres e-mail.")
    @PostMapping("/forgot-password")
    fun forgotPassword(@RequestBody request: ForgotPasswordRequest): ResponseEntity<String> {
        passwordResetService.createTokenAndSendEmail(request.email)
        return ResponseEntity.ok("Jeśli e-mail istnieje w bazie, wysłano na niego link do resetu hasła.")
    }

    @Operation(summary = "Resetowanie hasła", description = "Zmienia hasło użytkownika na podstawie tokena z e-maila.")
    @PostMapping("/reset-password")
    fun resetPassword(@RequestBody request: ResetPasswordRequest): ResponseEntity<String> {
        val success = passwordResetService.resetPassword(request)
        return if (success) {
            ResponseEntity.ok("Hasło zostało pomyślnie zmienione.")
        } else {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nieprawidłowy lub wygasły token.")
        }
    }

    @Operation(summary = "Rejestracja nowego użytkownika", description = "Tworzy nowe konto klienta w systemie.")
    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterUserRequest): ResponseEntity<UserDTO> {
        val createUserRequest = CreateUserRequest(
            name = request.name,
            surname = request.surname,
            email = request.email,
            password = request.password,
            isOperator = false
        )
        val user = userService.createUser(createUserRequest)
        return ResponseEntity.status(HttpStatus.CREATED).body(user)
    }

    @GetMapping("/version")
    fun getVersion(): ResponseEntity<Map<String, String>> {
        return ResponseEntity.ok(mapOf("version" to "v2-custom-swagger"))
    }
}
