package com.parkingplus.users

import com.parkingplus.users.requests.CreateUserRequest
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    @Transactional(readOnly = true)
    fun getAllUsers(): List<UserDTO> {
        return userRepository.findAll().map { it.toDTO() }
    }

    @Transactional
    fun createUser(request: CreateUserRequest): UserDTO {
        if (userRepository.existsByEmail(request.email)) {
            throw IllegalArgumentException("User with email ${request.email} already exists.")
        }

        val hashedPassword = passwordEncoder.encode(request.password)
        val entity = request.toEntity(hashedPassword)

        return userRepository.save(entity).toDTO()
    }

    @Transactional(readOnly = true)
    fun getUserById(id: Long): UserDTO {
        return userRepository.findById(id)
            .map { it.toDTO() }
            .orElseThrow { NoSuchElementException("User with id: $id not found.") }
    }

    @Transactional
    fun deleteUser(id: Long) {
        if (!userRepository.existsById(id)) {
            throw NoSuchElementException("User with id: $id not found.")
        }
        userRepository.deleteById(id)
    }
}