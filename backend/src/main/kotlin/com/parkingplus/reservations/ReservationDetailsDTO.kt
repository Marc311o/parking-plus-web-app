package com.parkingplus.reservations

import com.fasterxml.jackson.annotation.JsonFormat
import com.fasterxml.jackson.annotation.JsonProperty
import com.parkingplus.reservations.enums.ReservationStatus
import com.parkingplus.vehicles.enums.CarType
import java.math.BigDecimal
import java.time.LocalDateTime

data class ReservationDetailsDTO(
    val id: Long,
    
    @JsonProperty("created_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    val createdAt: LocalDateTime,
    
    @JsonProperty("start_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    val startTime: LocalDateTime,
    
    @JsonProperty("end_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    val endTime: LocalDateTime,
    
    val price: BigDecimal,
    val status: ReservationStatus,
    
    @JsonProperty("parking_place_id")
    val parkingPlaceId: String,
    
    @JsonProperty("vehicle_licence_plate")
    val vehicleLicencePlate: String,
    
    @JsonProperty("vehicle_type")
    val vehicleType: CarType
)

fun ReservationEntity.toDetailsDTO() = ReservationDetailsDTO(
    id = this.id ?: 0L,
    createdAt = this.createdAt,
    startTime = this.startTime,
    endTime = this.endTime,
    price = this.price,
    status = this.status,
    parkingPlaceId = this.parkingSpace.id,
    vehicleLicencePlate = this.vehicle.licensePlate,
    vehicleType = this.vehicle.carType
)
