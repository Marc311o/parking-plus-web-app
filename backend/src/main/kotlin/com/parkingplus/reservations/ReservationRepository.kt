package com.parkingplus.reservations

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.data.jpa.repository.Query
import java.time.LocalDateTime

@Repository
interface ReservationRepository : JpaRepository<ReservationEntity, Long> {
    @Query("SELECT r FROM ReservationEntity r WHERE r.parkingSpace.id = :spaceId AND r.status = 'CONFIRMED' AND " +
           "(r.startTime < :endTime AND r.endTime > :startTime)")
    fun findOverlappingReservations(spaceId: String, startTime: LocalDateTime, endTime: LocalDateTime): List<ReservationEntity>

    fun findByUserIdOrderByCreatedAtDesc(userId: Long): List<ReservationEntity>
}
