package com.parkingplus.parkinghistory

import com.parkingplus.parkingspaces.ParkingSpaceRepository
import com.parkingplus.vehicles.VehicleRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime

@Service
class ParkingHistoryService(
    private val parkingHistoryRepository: ParkingHistoryRepository,
    private val vehicleRepository: VehicleRepository,
    private val parkingSpaceRepository: ParkingSpaceRepository
) {
    @Transactional(readOnly = true)
    fun getAllParkingHistory(): List<ParkingHistoryDTO> {
        return parkingHistoryRepository.findAll().map { it.toDTO() }
    }

    @Transactional(readOnly = true)
    fun getActiveParkingHistory(): List<ParkingHistoryDTO> {
        return parkingHistoryRepository.findAllByEndTimeIsNull().map { it.toDTO() }
    }

    @Transactional(readOnly = true)
    fun getParkingHistoryByVehicle(vehicleId: Long): List<ParkingHistoryDTO> {
        return parkingHistoryRepository.findAllByVehicleId(vehicleId).map { it.toDTO() }
    }

    @Transactional(readOnly = true)
    fun getParkingHistoryByParkingSpace(parkingSpaceId: String): List<ParkingHistoryDTO> {
        return parkingHistoryRepository.findAllByParkingSpaceId(parkingSpaceId).map { it.toDTO() }
    }

    @Transactional
    fun createParkingHistory(dto: ParkingHistoryDTO): ParkingHistoryDTO {
        val vehicle = vehicleRepository.findById(dto.vehicleId)
            .orElseThrow { NoSuchElementException("Could not find vehicle with id ${dto.vehicleId}") }

        val parkingSpace = parkingSpaceRepository.findById(dto.parkingSpaceId)
            .orElseThrow { NoSuchElementException("Could not find parking space with id ${dto.parkingSpaceId}") }

        if (parkingHistoryRepository.existsByParkingSpaceIdAndEndTimeIsNull(dto.parkingSpaceId)) {
            throw IllegalArgumentException("Parking space with id ${dto.parkingSpaceId} is already occupied.")
        }

        if (parkingHistoryRepository.findByVehicleLicensePlateAndEndTimeIsNull(vehicle.licensePlate) != null) {
            throw IllegalArgumentException("Vehicle with license plate ${vehicle.licensePlate} already has an active parking entry.")
        }

        val entity = ParkingHistoryEntity(
            vehicle = vehicle,
            parkingSpace = parkingSpace,
            startTime = dto.startTime,
            endTime = dto.endTime,
            price = dto.price,
            photoPath = dto.photoPath
        )

        return parkingHistoryRepository.save(entity).toDTO()
    }

    @Transactional
    fun endParking(licensePlate: String): ParkingHistoryDTO {
        val activeParking = parkingHistoryRepository.findByVehicleLicensePlateAndEndTimeIsNull(licensePlate)
            ?: throw NoSuchElementException("No active parking entry found for vehicle $licensePlate")

        activeParking.endTime = LocalDateTime.now()
        //TODO: Calculate price based on parking tariffs and duration

        return parkingHistoryRepository.save(activeParking).toDTO()
    }

    @Transactional
    fun deleteParkingHistory(id: Long) {
        if (!parkingHistoryRepository.existsById(id)) {
            throw NoSuchElementException("Parking history entry with id $id does not exist.")
        }
        parkingHistoryRepository.deleteById(id)
    }

    @Transactional
    fun deleteAllParkingHistory() {
        parkingHistoryRepository.deleteAll()
    }

    @Transactional(readOnly = true)
    fun getDailyRevenue(date: LocalDate): Double {
        val startOfDay = date.atStartOfDay()
        val endOfDay = date.atTime(LocalTime.MAX)
        return parkingHistoryRepository.sumPriceByEndTimeBetween(startOfDay, endOfDay)
    }
}