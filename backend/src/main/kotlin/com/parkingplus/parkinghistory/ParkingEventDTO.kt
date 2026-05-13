package com.parkingplus.parkinghistory

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime

enum class ParkingEventType {
    ENTRY,
    EXIT
}

data class ParkingEventDTO(
    val id: Long,
    val plateNumber: String,
    val eventType: ParkingEventType,
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    val eventDate: LocalDateTime,
    val ownerName: String,
    val ownerSurname: String,
    val ownerEmail: String,
    val carPhotoPath: String?
)
