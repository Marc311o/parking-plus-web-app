package com.parkingplus.parkinghistory

fun ParkingHistoryEntity.toDTO() = ParkingHistoryDTO(
    id = id,
    vehicleId = vehicle.id ?: throw IllegalStateException("Vehicle ID cannot be null"),
    parkingSpaceId = parkingSpace.id ?: throw IllegalStateException("Parking space ID cannot be null"),
    startTime = startTime,
    endTime = endTime,
    price = price,
    photoPath = photoPath
)