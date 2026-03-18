package com.parkingplus.parkinghistory

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ParkingHistoryRepository : JpaRepository<ParkingHistoryEntity, Long> {
    fun findAllByEndTimeIsNull(): List<ParkingHistoryEntity>
    fun findAllByVehicleId(vehicleId: Int): List<ParkingHistoryEntity>
    fun findByVehicleLicensePlateAndEndTimeIsNull(licensePlate: String): ParkingHistoryEntity?
    fun existsByParkingSpaceIdAndEndTimeIsNull(parkingSpaceId: String): Boolean
}