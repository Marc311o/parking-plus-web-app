package com.parkingplus

import com.parkingplus.users.UserEntity
import com.parkingplus.users.UserRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class DataInitializer(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        if (userRepository.findAllByIsOperatorTrue().isEmpty()) {
            val admin = UserEntity(
                name = "Admin",
                surname = "Systemowy",
                email = "admin@parking.pl",
                password = passwordEncoder.encode("admin123"),
                isOperator = true
            )
            userRepository.save(admin)
            println(">>> Utworzono konto administratora: admin@parking.pl / admin123")
        }
    }
}