package com.parkingplus.parkingspaces

import com.parkingplus.parkingspaces.enums.ParkingSpaceStatus
import com.parkingplus.parkingspaces.enums.SpaceType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

data class ParkingSpaceDTO (
    @field:NotBlank(message = "Parking space ID is required")
    val id: String = "", //TODO Jakiegos enuma moze bym tu strzelila albo pomyslala o czyms zeby nie bylo to stringiem, ale na razie zostawie

    @field:NotNull(message = "Status is required")
    val status: ParkingSpaceStatus = ParkingSpaceStatus.FREE,

    @field:NotNull(message = "Space type is required")
    val spaceType: SpaceType = SpaceType.REGULAR_ABLEBODIED,

    val level: Int = 0,
)