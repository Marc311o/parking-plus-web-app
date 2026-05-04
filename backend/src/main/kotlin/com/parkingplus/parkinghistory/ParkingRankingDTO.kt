package com.parkingplus.parkinghistory

enum class ParkingFloor(val level: Int) {
    A(1),
    B(2)
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