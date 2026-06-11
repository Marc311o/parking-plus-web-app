package com.parkingplus.parkinghistory

import com.parkingplus.parkingspaces.enums.SpaceType
import java.time.LocalDate

data class AverageStayCategoryItemDTO(
    val spaceType: SpaceType,
    val averageMinutes: Long
)

data class AverageStayResponseDTO(
    val period: AggregationPeriod,
    val from: LocalDate,
    val to: LocalDate,
    val overallAverageMinutes: Long,
    val categories: List<AverageStayCategoryItemDTO>
)