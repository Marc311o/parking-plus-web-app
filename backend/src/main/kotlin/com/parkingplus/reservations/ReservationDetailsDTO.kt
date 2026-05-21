package com.parkingplus.reservations

import com.fasterxml.jackson.annotation.JsonFormat
import com.parkingplus.reservations.enums.ReservationStatus
import com.parkingplus.vehicles.enums.CarType
import java.math.BigDecimal
import java.time.LocalDateTime

data class ReservationDetailsDTO(
    val id: Long,
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    val created_at: LocalDateTime,
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    val start_time: LocalDateTime,
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    val end_time: LocalDateTime,
    val price: BigDecimal,
    val status: ReservationStatus,
    val parking_place_id: String,
    val vehicle_licence_plate: String,
    val vehicle_type: CarType
)

fun ReservationEntity.toDetailsDTO() = ReservationDetailsDTO(
    id = this.id ?: 0L,
    created_at = this.createdAt,
    start_time = this.startTime,
    end_time = this.endTime,
    price = this.price,
    status = this.status,
    parking_place_id = this.parkingSpace.id,
    vehicle_licence_plate = this.vehicle.licensePlate,
    vehicle_type = this.vehicle.carType
)
