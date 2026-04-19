package com.parkingplus.auth

import com.parkingplus.security.JwtService
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
    private val jwtService: JwtService
) {

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<Any> {
        println(">>> Otrzymano żądanie logowania dla: ${request.email}")
        val user = userRepository.findByEmail(request.email).orElse(null)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nieprawidlowy email lub haslo")

        if (!passwordEncoder.matches(request.password, user.password)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Nieprawidlowy email lub haslo")
        }

        val token = jwtService.generateToken(user)
        return ResponseEntity.ok(LoginResponse(token))
    }
}