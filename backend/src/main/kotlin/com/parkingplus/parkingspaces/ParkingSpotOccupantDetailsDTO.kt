package com.parkingplus.parkingspaces

import com.parkingplus.parkingspaces.enums.ParkingSpaceStatus
import com.parkingplus.parkingspaces.enums.SpaceType
import java.time.LocalDateTime

data class ParkingSpotOccupantDetailsDTO(
    val ownerId: String,
    val ownerName: String,
    val ownerEmail: String,
    val ownerPhone: String?,
    val vehiclePlate: String,
    val entryTime: LocalDateTime,
    val parkingDurationSec: Long,
    val amountDue: Double,
    val imageUrl: String?
)

data class ParkingSpotDetailsDTO(
    val id: String,
    val type: SpaceType,
    val status: ParkingSpaceStatus,
    val level: Int,
    val occupant: ParkingSpotOccupantDetailsDTO? = null
)