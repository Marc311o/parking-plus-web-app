package com.parkingplus.parkinghistory

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface ParkingHistoryRepository : JpaRepository<ParkingHistoryEntity, Long> {
    fun findAllByEndTimeIsNull(): List<ParkingHistoryEntity>
    fun findAllByVehicleId(vehicleId: Long): List<ParkingHistoryEntity>
    fun findByVehicleLicensePlateAndEndTimeIsNull(licensePlate: String): ParkingHistoryEntity?
    fun existsByParkingSpaceIdAndEndTimeIsNull(parkingSpaceId: String): Boolean
    fun findAllByParkingSpaceId(parkingSpaceId: String): List<ParkingHistoryEntity>
    fun findAllByEndTimeBetween(start: LocalDateTime, end: LocalDateTime): List<ParkingHistoryEntity>
}