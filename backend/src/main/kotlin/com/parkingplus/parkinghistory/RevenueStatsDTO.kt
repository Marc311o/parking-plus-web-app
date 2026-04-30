package com.parkingplus.parkinghistory

import java.time.LocalDate

data class RevenuePointDTO(
    val label: String,
    val value: Double
)

data class RevenueStatsResponseDTO(
    val period: AggregationPeriod,
    val from: LocalDate,
    val to: LocalDate,
    val total: Double,
    val previousPeriodChangePercent: Double,
    val currency: String = "PLN",
    val points: List<RevenuePointDTO>
)