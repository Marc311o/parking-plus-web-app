package com.parkingplus.transactions

import com.parkingplus.transactions.enums.TransactionType

fun TransactionEntity.toDTO() = TransactionDTO(
    id = id,
    userId = user.id ?: throw IllegalStateException("User ID cannot be null"),
    type = type,
    amount = amount,
    realisedAt = realisedAt
)

