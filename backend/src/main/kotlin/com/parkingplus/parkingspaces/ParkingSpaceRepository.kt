package com.parkingplus.parkingspaces

import com.parkingplus.parkingspaces.enums.SpaceType
import org.springframework.data.jpa.repository.JpaRepository
import com.parkingplus.parkingspaces.enums.ParkingSpaceStatus
import org.springframework.data.jpa.repository.Query


interface ParkingSpaceRepository : JpaRepository<ParkingSpaceEntity, String> {
    fun findAllByLevel(level: Int): List<ParkingSpaceEntity>
    fun findAllBySpaceType(spaceType: SpaceType): List<ParkingSpaceEntity>
    fun findAllByStatus(status: ParkingSpaceStatus): List<ParkingSpaceEntity>
    fun findAllByLevelAndSpaceType(level: Int, spaceType: SpaceType): List<ParkingSpaceEntity>

    @Query("SELECT p.status, COUNT(p) FROM ParkingSpaceEntity p GROUP BY p.status")
    fun countByStatusGrouped(): List<Array<Any>>
}