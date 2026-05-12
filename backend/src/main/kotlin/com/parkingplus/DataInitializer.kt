package com.parkingplus

import com.parkingplus.users.UserEntity
import com.parkingplus.users.UserRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.CommandLineRunner
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

@Component
class DataInitializer(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val testDataGenerator: com.parkingplus.testdata.TestDataGenerator,
    @Value("\${app.admin.email:admin@parking.pl}") private val adminEmail: String,
    @Value("\${app.admin.password:#{null}}") private val adminPassword: String?,
    @Value("\${app.testdata.enabled:false}") private val testDataEnabled: Boolean
) : CommandLineRunner {

    override fun run(vararg args: String?) {
        initializeAdmin()
        if (testDataEnabled) {
            testDataGenerator.generate()
        }
    }

    private fun initializeAdmin() {
        if (userRepository.findAllByIsOperatorTrue().isEmpty()) {
            val password = adminPassword
                ?: throw IllegalStateException(
                    "app.admin.password is not configured. " +
                    "Set the APP_ADMIN_PASSWORD environment variable or provide app.admin.password in your properties."
                )

            val admin = UserEntity(
                name = "Admin",
                surname = "Systemowy",
                email = adminEmail,
                password = passwordEncoder.encode(password),
                isOperator = true
            )
            userRepository.save(admin)
            println(">>> Utworzono konto administratora: $adminEmail")
        }
    }
}
