package com.parkingplus.parkinghistory

import com.fasterxml.jackson.annotation.JsonFormat
import java.time.LocalDateTime

data class PurchaseDetailsDTO (
    val userID: Long?,
    val licensePlate: String,
    val price: Double?,
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    val startTime: LocalDateTime,
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    val endTime: LocalDateTime?
)