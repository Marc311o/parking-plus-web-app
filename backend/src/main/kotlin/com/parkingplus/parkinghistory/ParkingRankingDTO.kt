package com.parkingplus.parkinghistory

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
    val total: Long,
    val points: List<ParkingSpaceRankingPointDTO>
)