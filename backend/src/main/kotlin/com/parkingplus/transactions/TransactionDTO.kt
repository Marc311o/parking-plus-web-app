package com.parkingplus.transactions

import com.parkingplus.transactions.enums.TransactionType
import jakarta.validation.constraints.PositiveOrZero
import java.time.LocalDateTime

data class TransactionDTO(
    val id: Long? = null,
    val userId: Long = 0L,
    val type: TransactionType = TransactionType.DEPOSIT,

    @field:PositiveOrZero(message = "Amount must be greater than or equal to 0")
    val amount: Float = 0f,
    val realisedAt: LocalDateTime = LocalDateTime.now()
)