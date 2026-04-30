package com.parkingplus.parkinghistory

import java.time.LocalDate

enum class AggregationPeriod {
    DAILY,
    WEEKLY,
    YEARLY
}

data class EntriesPointDTO(
    val label: String,
    val value: Long
)

data class EntriesResponseDTO(
    val period: AggregationPeriod,
    val from: LocalDate,
    val to: LocalDate,
    val total: Long,
    val points: List<EntriesPointDTO>
)