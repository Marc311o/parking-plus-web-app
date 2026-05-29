package com.parkingplus.parkinghistory

import com.parkingplus.parkingspaces.ParkingSpaceEntity
import com.parkingplus.vehicles.VehicleEntity
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "parking_history")
class ParkingHistoryEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "entry_id")
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    val vehicle: VehicleEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parking_space_id", nullable = false)
    val parkingSpace: ParkingSpaceEntity,

    @Column(name = "start", nullable = false)
    var startTime: LocalDateTime,

    @Column(name = "end_time")
    var endTime: LocalDateTime? = null,

    @Column(name = "price", nullable = false)
    var price: Double = 0.0,

    @Column(name = "barrier_photo_path", nullable = true)
    var barrierPhotoPath: String? = null,

    @Column(name = "spot_photo_path", nullable = true)
    var spotPhotoPath: String? = null
)