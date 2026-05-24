package com.parkingplus.vehicles

import com.parkingplus.vehicles.enums.CarType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class UpdateVehicleDTO(

    @field:NotBlank(message = "License plate is required")
    val licensePlate: String,

    @field:NotNull(message = "Car type is required")
    val carType: CarType
)