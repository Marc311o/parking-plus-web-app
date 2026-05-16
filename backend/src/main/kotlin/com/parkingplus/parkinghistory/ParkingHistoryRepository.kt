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
    fun findByParkingSpaceIdAndEndTimeIsNull(parkingSpaceId: String): ParkingHistoryEntity?
    fun existsByVehicleIdAndEndTimeIsNull(vehicleId: Long): Boolean

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

    interface RevenueProjection {
        val endTime: LocalDateTime
        val price: Double
    }

    interface AverageStayProjection {
        val startTime: LocalDateTime
        val endTime: LocalDateTime
        val spaceType: SpaceType
    }

    interface SpaceRankingProjection {
        val spaceId: String
        val usageCount: Long
    }


    @Query("SELECT p.endTime as endTime, p.price as price FROM ParkingHistoryEntity p WHERE p.endTime BETWEEN :start AND :end")
    fun findRevenueBetween(
        @Param("start") start: LocalDateTime,
        @Param("end") end: LocalDateTime
    ): List<RevenueProjection>

    @Query("SELECT p.startTime as startTime, p.endTime as endTime, p.parkingSpace.spaceType as spaceType FROM ParkingHistoryEntity p WHERE p.endTime BETWEEN :start AND :end")
    fun findCompletedStaysBetween(
        @Param("start") start: LocalDateTime,
        @Param("end") end: LocalDateTime
    ): List<AverageStayProjection>

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

    @Query(
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

    @Query("SELECT p FROM ParkingHistoryEntity p JOIN FETCH p.vehicle v JOIN FETCH v.owner")
    fun findAllWithVehicleAndOwner(): List<ParkingHistoryEntity>
}