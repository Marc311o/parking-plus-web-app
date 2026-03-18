package com.parkingplus.users

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

interface UserRepository : JpaRepository<UserEntity, Long> {

    fun findByEmail(email: String): Optional<UserEntity>
    fun existsByEmail(email: String): Boolean
    fun findBySurnameContainingIgnoreCase(surname: String): List<UserEntity>
    fun findAllByIsOperatorTrue(): List<UserEntity>     // fetches operators
    fun findAllByIsOperatorFalse(): List<UserEntity>    // fethces users
    fun findByNameAndSurname(name: String, surname: String): List<UserEntity>
}