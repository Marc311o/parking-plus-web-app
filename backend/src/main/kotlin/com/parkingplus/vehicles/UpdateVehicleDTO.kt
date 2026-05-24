package com.parkingplus.vehicles

import com.parkingplus.vehicles.enums.CarType
import jakarta.validation.constraints.NotBlank

data class UpdateVehicleDTO(

    @field:NotBlank
    val licensePlate: String,

    val carType: CarType
)