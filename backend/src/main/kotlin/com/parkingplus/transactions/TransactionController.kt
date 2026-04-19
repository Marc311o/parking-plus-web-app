package com.parkingplus.transactions

import com.parkingplus.transactions.enums.TransactionType
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/transactions")
class TransactionController(
    private val transactionService: TransactionService
) {

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    fun getAllTransactions(): List<TransactionDTO> =
        transactionService.getAllTransactions()

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    fun getTransactionById(@PathVariable id: Long): TransactionDTO =
        transactionService.getTransactionById(id)

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/user/{userId}")
    fun getTransactionsByUser(@PathVariable userId: Long, authentication: Authentication): ResponseEntity<List<TransactionDTO>> {
        val authUserId = authentication.details as? Long
        if (authentication.authorities.none { it.authority == "ROLE_ADMIN" } && authUserId != userId) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }
        return ResponseEntity.ok(transactionService.getTransactionsByUser(userId))
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/type/{type}")
    fun getTransactionsByType(@PathVariable type: TransactionType): List<TransactionDTO> =
        transactionService.getTransactionsByType(type)

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

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteTransaction(@PathVariable id: Long) =
        transactionService.deleteTransaction(id)
}
