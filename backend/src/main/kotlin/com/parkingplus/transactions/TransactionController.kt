package com.parkingplus.transactions

import com.parkingplus.transactions.enums.TransactionType
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/transactions")
@Tag(name = "Transactions", description = "Zarządzanie operacjami finansowymi (wpłaty, płatności za parking)")
class TransactionController(
    private val transactionService: TransactionService
) {

    @Operation(summary = "Pobierz wszystkie transakcje (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    fun getAllTransactions(): List<TransactionDTO> =
        transactionService.getAllTransactions()

    @Operation(summary = "Pobierz transakcję po ID (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    fun getTransactionById(@PathVariable id: Long): TransactionDTO =
        transactionService.getTransactionById(id)

    @Operation(summary = "Pobierz transakcje użytkownika")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/user/{userId}")
    fun getTransactionsByUser(@PathVariable userId: Long, authentication: Authentication): ResponseEntity<List<TransactionDTO>> {
        val authUserId = authentication.details as? Long
        if (authentication.authorities.none { it.authority == "ROLE_ADMIN" } && authUserId != userId) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }
        return ResponseEntity.ok(transactionService.getTransactionsByUser(userId))
    }

    @Operation(summary = "Pobierz transakcje według typu (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/type/{type}")
    fun getTransactionsByType(@PathVariable type: TransactionType): List<TransactionDTO> =
        transactionService.getTransactionsByType(type)

    @Operation(summary = "Pobierz transakcje użytkownika według typu")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/user/{userId}/type/{type}")
    fun getTransactionsByUserAndType(
        @PathVariable userId: Long,
        @PathVariable type: TransactionType,
        authentication: Authentication
    ): ResponseEntity<List<TransactionDTO>> {
        val authUserId = authentication.details as? Long
        if (authentication.authorities.none { it.authority == "ROLE_ADMIN" } && authUserId != userId) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }
        return ResponseEntity.ok(transactionService.getTransactionsByUserAndType(userId, type))
    }

    @Operation(summary = "Utwórz nową transakcję", description = "Rejestruje wpłatę na saldo lub płatność.")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createTransaction(@Valid @RequestBody dto: TransactionDTO, authentication: Authentication): TransactionDTO {
        val authUserId = authentication.details as? Long
        val effectiveUserId = if (authentication.authorities.any { it.authority == "ROLE_ADMIN" }) {
            dto.userId
        } else {
            authUserId ?: throw IllegalStateException("Authenticated user ID not available")
        }
        return transactionService.createTransaction(dto.copy(userId = effectiveUserId))
    }

    @Operation(summary = "Usuń transakcję (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteTransaction(@PathVariable id: Long) =
        transactionService.deleteTransaction(id)
}
