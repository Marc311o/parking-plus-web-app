package com.parkingplus.parkinghistory

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.PositiveOrZero
import java.time.LocalDateTime

data class ParkingHistoryDTO(
    val id: Long? = null,

    @field:NotNull(message = "Vehicle ID is required")
    val vehicleId: Long,

    @field:NotNull(message = "Parking space ID is required")
    val parkingSpaceId: String,

    @field:NotNull(message = "Start time is required")
    val startTime: LocalDateTime,

    val endTime: LocalDateTime? = null,

    @field:PositiveOrZero(message = "Price must be greater than or equal to 0")
    val price: Double = 0.0,

    @field:NotBlank(message = "Photo path is required")
    val photoPath: String
)