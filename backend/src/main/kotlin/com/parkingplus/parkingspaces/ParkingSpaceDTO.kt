package com.parkingplus.parkingspaces

import com.parkingplus.parkingspaces.enums.ParkingSpaceStatus
import com.parkingplus.parkingspaces.enums.SpaceType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class ParkingSpaceDTO (
    @field:NotBlank(message = "Parking space ID is required")
    val id: String,

    @field:NotNull(message = "Status is required")
    val status: ParkingSpaceStatus,

    @field:NotNull(message = "Space type is required")
    val spaceType: SpaceType,

    val level: Int
)