package com.parkingplus.vehicles

import com.parkingplus.vehicles.enums.CarType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class VehicleDTO(
    val id: Long? = null,

    @field:NotBlank(message = "License plate number is required")
    val licensePlate: String,

    @field:NotNull(message = "Owner ID is required")
    val ownerId: Long,

    @field:NotNull(message = "Car type is required")
    val carType: CarType
)