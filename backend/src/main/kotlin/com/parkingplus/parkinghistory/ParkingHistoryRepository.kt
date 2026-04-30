package com.parkingplus.parkinghistory

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import java.time.LocalDateTime

@Repository
interface ParkingHistoryRepository : JpaRepository<ParkingHistoryEntity, Long> {
    fun findAllByEndTimeIsNull(): List<ParkingHistoryEntity>
    fun findAllByVehicleId(vehicleId: Long): List<ParkingHistoryEntity>
    fun findByVehicleLicensePlateAndEndTimeIsNull(licensePlate: String): ParkingHistoryEntity?
    fun existsByParkingSpaceIdAndEndTimeIsNull(parkingSpaceId: String): Boolean
    fun findAllByParkingSpaceId(parkingSpaceId: String): List<ParkingHistoryEntity>

    @Query("SELECT COALESCE(SUM(p.price), 0.0) FROM ParkingHistoryEntity p WHERE p.endTime BETWEEN :start AND :end")
    fun sumPriceByEndTimeBetween(
        @Param("start") start: LocalDateTime,
        @Param("end") end: LocalDateTime
    ): Double

    fun findAllByStartTimeBetween(start: LocalDateTime, end: LocalDateTime): List<ParkingHistoryEntity>
}