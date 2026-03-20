package com.parkingplus.parkingspaces

fun toDTO(entity: ParkingSpaceEntity) = ParkingSpaceDTO(
        id = entity.id,
        status = entity.status,
        spaceType = entity.spaceType,
        level = entity.level
    )
