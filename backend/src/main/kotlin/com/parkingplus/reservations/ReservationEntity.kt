package com.parkingplus.reservations

import com.parkingplus.parkingspaces.ParkingSpaceEntity
import com.parkingplus.reservations.enums.ReservationStatus
import com.parkingplus.users.UserEntity
import com.parkingplus.vehicles.VehicleEntity
import jakarta.persistence.*
import java.time.LocalDateTime
import java.math.BigDecimal

@Entity
@Table(name = "reservations")
class ReservationEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: UserEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    val vehicle: VehicleEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_space_id", nullable = false)
    val parkingSpace: ParkingSpaceEntity,

    @Column(name = "start_time", nullable = false)
    var startTime: LocalDateTime,

    @Column(name = "end_time", nullable = false)
    var endTime: LocalDateTime,

    @Column(name = "price", nullable = false)
    var price: BigDecimal,

    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    var status: ReservationStatus = ReservationStatus.PENDING
)
