package com.parkingplus.parkinghistory

data class ParkingEventDTO(
    val id: Long,
    val plateNumber: String,
    val eventType: String,
    val eventDate: String,
    val ownerName: String,
    val ownerSurname: String,
    val ownerEmail: String,
    val carPhotoPath: String?
)
