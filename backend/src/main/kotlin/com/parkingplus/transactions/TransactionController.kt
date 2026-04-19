package com.parkingplus.transactions

import com.parkingplus.transactions.enums.TransactionType
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
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

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/{id}")
    fun getTransactionById(@PathVariable id: Long): TransactionDTO =
        transactionService.getTransactionById(id)

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/user/{userId}")
    fun getTransactionsByUser(@PathVariable userId: Long): List<TransactionDTO> =
        transactionService.getTransactionsByUser(userId)

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/type/{type}")
    fun getTransactionsByType(@PathVariable type: TransactionType): List<TransactionDTO> =
        transactionService.getTransactionsByType(type)

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/user/{userId}/type/{type}")
    fun getTransactionsByUserAndType(
        @PathVariable userId: Long,
        @PathVariable type: TransactionType
    ): List<TransactionDTO> =
        transactionService.getTransactionsByUserAndType(userId, type)

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createTransaction(@Valid @RequestBody dto: TransactionDTO): TransactionDTO =
        transactionService.createTransaction(dto)

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteTransaction(@PathVariable id: Long) =
        transactionService.deleteTransaction(id)
}