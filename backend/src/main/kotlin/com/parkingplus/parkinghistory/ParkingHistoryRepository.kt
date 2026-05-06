package com.parkingplus.parkinghistory

import com.parkingplus.parkingspaces.enums.SpaceType
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

    @Query("SELECT p.startTime FROM ParkingHistoryEntity p WHERE p.startTime BETWEEN :start AND :end")
    fun findStartTimesBetween(
        @Param("start") start: LocalDateTime,
        @Param("end") end: LocalDateTime
    ): List<LocalDateTime>

    fun findByParkingSpaceIdAndEndTimeIsNull(parkingSpaceId: String): ParkingHistoryEntity?


    @Query("SELECT p.startTime as startTime, p.endTime as endTime, p.parkingSpace.spaceType as spaceType FROM ParkingHistoryEntity p WHERE p.endTime BETWEEN :start AND :end")
    fun findCompletedStaysBetween(
        @Param("start") start: LocalDateTime,
        @Param("end") end: LocalDateTime
    ): List<AverageStayProjection>

interface AverageStayProjection {
    val startTime: LocalDateTime
    val endTime: LocalDateTime
    val spaceType: SpaceType
    @Query(
        "SELECT p.parkingSpace.id as spaceId, COUNT(p.id) as usageCount " +
                "FROM ParkingHistoryEntity p " +
                "WHERE p.parkingSpace.level = :level " +
                "AND p.startTime BETWEEN :start AND :end " +
                "GROUP BY p.parkingSpace.id " +
                "ORDER BY usageCount DESC"
    )
    fun findSpaceRankingForLevelAndDate(
        @Param("level") level: Int,
        @Param("start") start: LocalDateTime,
        @Param("end") end: LocalDateTime
    ): List<SpaceRankingProjection>

interface SpaceRankingProjection {
    val spaceId: String
    val usageCount: Long
        "SELECT p FROM ParkingHistoryEntity p " +
                "WHERE p.parkingSpace.id = :spaceId " +
                "AND p.startTime <= :endOfDay " +
                "AND (p.endTime > :startOfDay OR p.endTime IS NULL)"
    )
    fun findTimelineForSpaceAndDate(
        @Param("spaceId") spaceId: String,
        @Param("startOfDay") startOfDay: LocalDateTime,
        @Param("endOfDay") endOfDay: LocalDateTime
    ): List<ParkingHistoryEntity>
}