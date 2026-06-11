package com.parkingplus.transactions

import com.parkingplus.users.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.NoSuchElementException
import com.parkingplus.transactions.enums.TransactionType



@Service
class TransactionService(
    private val transactionRepository: TransactionRepository,
    private val userRepository: UserRepository
) {

    @Transactional(readOnly = true)
    fun getAllTransactions(): List<TransactionDTO> {
        return transactionRepository.findAll().map { it.toDTO() }
    }

    @Transactional(readOnly = true)
    fun getTransactionById(id: Long): TransactionDTO {
        val entity = transactionRepository.findById(id.toInt())
            .orElseThrow { NoSuchElementException("Transaction with id $id does not exist") }
        return entity.toDTO()
    }

    @Transactional(readOnly = true)
    fun getTransactionsByUser(userId: Long): List<TransactionDTO> {
        val user = userRepository.findById(userId)
            .orElseThrow { NoSuchElementException("User with id $userId does not exist") }
        return transactionRepository.findAllByUser(user).map { it.toDTO() }
    }

    @Transactional(readOnly = true)
    fun getTransactionsByType(type: TransactionType): List<TransactionDTO> {
        return transactionRepository.findAllByType(type).map { it.toDTO() }
    }

    @Transactional(readOnly = true)
    fun getTransactionsByUserAndType(userId: Long, type: TransactionType): List<TransactionDTO> {
        val user = userRepository.findById(userId)
            .orElseThrow { NoSuchElementException("User with id $userId does not exist") }
        return transactionRepository.findAllByUserAndType(user, type).map { it.toDTO() }
    }

    @Transactional
    fun createTransaction(dto: TransactionDTO): TransactionDTO {
        val user = userRepository.findById(dto.userId)
            .orElseThrow { NoSuchElementException("User with id ${dto.userId} not found") }

        val entity = TransactionEntity(
            user = user,
            type = dto.type,
            amount = dto.amount,
            realisedAt = dto.realisedAt
        )

        return transactionRepository.save(entity).toDTO()
    }

    @Transactional
    fun deleteTransaction(id: Long) {
        if (!transactionRepository.existsById(id.toInt())) {
            throw NoSuchElementException("Transaction with id $id does not exist")
        }
        transactionRepository.deleteById(id.toInt())
    }
}