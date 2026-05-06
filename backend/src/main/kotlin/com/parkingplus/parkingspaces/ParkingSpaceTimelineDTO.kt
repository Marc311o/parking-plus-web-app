package com.parkingplus.parkingspaces

import com.parkingplus.parkingspaces.enums.ParkingSpaceTimelineStatus
import java.time.LocalDate


data class ParkingSpaceTimelineItemDTO(
    val status: ParkingSpaceTimelineStatus,
    val from: String,   // "HH:mm"
    val to: String      // "HH:mm"
)

data class ParkingSpaceTimelineResponseDTO(
    val spaceId: String,
    val date: LocalDate,
    val items: List<ParkingSpaceTimelineItemDTO>
)