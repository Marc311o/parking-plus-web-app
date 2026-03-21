package com.parkingplus.transactions

import com.parkingplus.transactions.enums.TransactionType
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/transactions")
class TransactionController(
    private val transactionService: TransactionService
) {

    @GetMapping
    fun getAllTransactions(): List<TransactionDTO> =
        transactionService.getAllTransactions()

    @GetMapping("/{id}")
    fun getTransactionById(@PathVariable id: Long): TransactionDTO =
        transactionService.getTransactionById(id)

    @GetMapping("/user/{userId}")
    fun getTransactionsByUser(@PathVariable userId: Long): List<TransactionDTO> =
        transactionService.getTransactionsByUser(userId)

    @GetMapping("/type/{type}")
    fun getTransactionsByType(@PathVariable type: TransactionType): List<TransactionDTO> =
        transactionService.getTransactionsByType(type)

    @GetMapping("/user/{userId}/type/{type}")
    fun getTransactionsByUserAndType(
        @PathVariable userId: Long,
        @PathVariable type: TransactionType
    ): List<TransactionDTO> =
        transactionService.getTransactionsByUserAndType(userId, type)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createTransaction(@Valid @RequestBody dto: TransactionDTO): TransactionDTO =
        transactionService.createTransaction(dto)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteTransaction(@PathVariable id: Long) =
        transactionService.deleteTransaction(id)
}