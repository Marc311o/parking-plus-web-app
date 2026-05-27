package com.parkingplus.parkinghistory

import java.time.LocalDate

enum class ParkingFloor(val level: Int) {
    A(0),
    B(1)
}

data class ParkingSpaceRankingPointDTO(
    val spaceId: String,
    val value: Long
)

data class ParkingSpaceRankingResponseDTO(
    val floor: ParkingFloor,
    val period: AggregationPeriod,
    val from: LocalDate,
    val to: LocalDate,
    val total: Long,
    val points: List<ParkingSpaceRankingPointDTO>
)