package com.parkingplus.users

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.*

@Repository
interface UserRepository : JpaRepository<UserEntity, Long> {

    fun findByEmail(email: String): java.util.Optional<UserEntity>
    fun existsByEmail(email: String): Boolean
    fun findBySurnameContainingIgnoreCase(surname: String): List<UserEntity>
    fun findAllByIsOperatorTrue(): List<UserEntity>
    fun findAllByIsOperatorFalse(): List<UserEntity>
    fun findByNameAndSurname(name: String, surname: String): List<UserEntity>

    @Query("SELECT u FROM UserEntity u WHERE " +
            "(:clientsOnly = false OR u.isOperator = false) AND " +
            "(:search IS NULL OR :search = '' OR " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.surname) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    fun findAllWithSearch(
        @Param("search") search: String?,
        @Param("clientsOnly") clientsOnly: Boolean,
        pageable: Pageable
    ): Page<UserEntity>
}