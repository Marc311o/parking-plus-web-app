package com.parkingplus.users

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(private val userRepository: UserRepository) {

    @Transactional(readOnly = true)
    fun getAllUsers(): List<UserDTO> {
        return userRepository.findAll().map { it.toDTO() }
    }

    @Transactional
    fun createUser(dto: UserDTO, password: String): UserDTO {
        if (userRepository.existsByEmail(dto.email)) {
            throw IllegalArgumentException("User with email ${dto.email} already exists.")
        }

        val entity = dto.toEntity(password)
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