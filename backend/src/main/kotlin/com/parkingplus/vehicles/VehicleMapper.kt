package com.parkingplus.vehicles

import com.parkingplus.users.UserEntity

fun VehicleEntity.toDTO() = VehicleDTO(
    id = id,
    licensePlate = licensePlate,
    ownerId = owner.id ?: throw IllegalStateException("Owner ID cannot be null"),
    carType = carType,
    isActive = isActive
)