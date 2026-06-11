package com.parkingplus.parkingspaces

fun ParkingSpaceEntity.toDTO() = ParkingSpaceDTO(
    id = id,
    status = status,
    spaceType = spaceType,
    level = level
)
