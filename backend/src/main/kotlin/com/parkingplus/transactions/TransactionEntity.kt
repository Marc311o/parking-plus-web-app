package com.parkingplus.transactions

import com.parkingplus.transactions.enums.TransactionType
import com.parkingplus.users.UserEntity
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "transaction")
class TransactionEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "transaction_id", nullable = false)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: UserEntity,

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    var type: TransactionType,

    @Column(name = "amount", nullable = false)
    var amount: Float,

    @Column(name = "realised_at", nullable = false)
    var realisedAt: LocalDateTime
)