package com.parkingplus.transactions

import com.parkingplus.transactions.enums.TransactionType
import java.time.LocalDateTime

data class TransactionDTO(
    val id: Int? = null,
    val userId: Long,
    val type: TransactionType,
    val amount: Float,
    val realisedAt: LocalDateTime
)