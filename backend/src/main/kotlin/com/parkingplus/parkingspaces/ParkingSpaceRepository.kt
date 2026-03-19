package com.parkingplus.parkingspaces

import com.parkingplus.parkingspaces.enums.SpaceType
import org.springframework.data.jpa.repository.JpaRepository

interface ParkingSpaceRepository : JpaRepository<ParkingSpaceEntity, String> {
    fun existsById(id: String): Boolean
    fun findById(id: String): ParkingSpaceEntity?
    fun findAllByLevel(level: Int): List<ParkingSpaceEntity>
    fun findAllBySpaceType(spaceType: SpaceType): List<ParkingSpaceEntity>
    fun findAllByStatus(status: String): List<ParkingSpaceEntity>
    fun findAllByLevelAndSpaceType(level: Int, spaceType: SpaceType): List<ParkingSpaceEntity>
}
