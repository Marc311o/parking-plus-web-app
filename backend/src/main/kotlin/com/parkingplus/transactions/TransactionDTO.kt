package com.parkingplus.transactions

import com.parkingplus.transactions.enums.TransactionType
import java.time.LocalDateTime

data class TransactionDTO(
    val id: Long? = null,
    val userId: Long = 0L,
    val type: TransactionType = TransactionType.DEPOSIT,
    val amount: Float = 0f,
    val realisedAt: LocalDateTime = LocalDateTime.now()
)