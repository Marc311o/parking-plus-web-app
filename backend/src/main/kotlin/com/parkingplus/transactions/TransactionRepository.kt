package com.parkingplus.transactions

import com.parkingplus.transactions.enums.TransactionType
import com.parkingplus.users.UserEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TransactionRepository : JpaRepository<TransactionEntity, Int> {

    fun findAllByUser(user: UserEntity): List<TransactionEntity>
    fun findAllByType(type: TransactionType): List<TransactionEntity>
    fun existsById(id: Int): Boolean
    fun findAllByUserAndType(user: UserEntity, type: TransactionType): List<TransactionEntity>
}