package com.parkingplus.parkinghistory

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
    val from: String,
    val to: String,
    val total: Long,
    val points: List<EntriesPointDTO>
)