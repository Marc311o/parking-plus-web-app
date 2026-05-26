package com.parkingplus.vehicles

import org.springframework.data.jpa.repository.JpaRepository

interface VehicleRepository : JpaRepository<VehicleEntity, Long> {
    override fun findAll(): List<VehicleEntity>
    fun existsByLicensePlate(licensePlate: String): Boolean
    fun findByLicensePlate(licensePlate: String): VehicleEntity?
    fun findAllByOwnerId(ownerId: Long): List<VehicleEntity>
    fun findAllByOwnerIdAndIsActiveTrue(ownerId: Long): List<VehicleEntity>
}