package com.parkingplus.parkingspaces

import com.parkingplus.parkinghistory.ParkingHistoryRepository
import com.parkingplus.parkingspaces.enums.ParkingSpaceStatus
import com.parkingplus.parkingspaces.enums.SpaceType
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.util.NoSuchElementException

@Service
class ParkingSpaceService(
    private val parkingSpaceRepository: ParkingSpaceRepository,
    private val parkingHistoryRepository: ParkingHistoryRepository
) {

    @Transactional(readOnly = true)
    fun getAllParkingSpaces(): List<ParkingSpaceDTO> =
        parkingSpaceRepository.findAll().map { it.toDTO() }

    @Transactional(readOnly = true)
    fun getParkingSpaceById(id: String): ParkingSpaceDTO =
        parkingSpaceRepository.findById(id)
            .orElseThrow { NoSuchElementException("Parking space with id $id does not exist.") }
            .toDTO()

    @Transactional(readOnly = true)
    fun getByLevel(level: Int): List<ParkingSpaceDTO> =
        parkingSpaceRepository.findAllByLevel(level).map { it.toDTO() }

    @Transactional(readOnly = true)
    fun getBySpaceType(spaceType: SpaceType): List<ParkingSpaceDTO> =
        parkingSpaceRepository.findAllBySpaceType(spaceType).map { it.toDTO() }

    @Transactional(readOnly = true)
    fun getByStatus(status: ParkingSpaceStatus): List<ParkingSpaceDTO> =
        parkingSpaceRepository.findAllByStatus(status).map { it.toDTO() }

    @Transactional(readOnly = true)
    fun getByLevelAndSpaceType(level: Int, spaceType: SpaceType): List<ParkingSpaceDTO> =
        parkingSpaceRepository.findAllByLevelAndSpaceType(level, spaceType).map { it.toDTO() }

    @Transactional
    fun createParkingSpace(dto: ParkingSpaceDTO): ParkingSpaceDTO {
        if (parkingSpaceRepository.existsById(dto.id)) {
            throw IllegalArgumentException("Parking space with id ${dto.id} already exists.")
        }

        val entity = ParkingSpaceEntity(
            id = dto.id,
            status = dto.status,
            spaceType = dto.spaceType,
            level = dto.level
        )

        return parkingSpaceRepository.save(entity).toDTO()
    }

    @Transactional
    fun updateParkingSpace(id: String, dto: ParkingSpaceDTO): ParkingSpaceDTO {
        val entity = parkingSpaceRepository.findById(id)
            .orElseThrow { NoSuchElementException("Parking space with id $id does not exist.") }

        entity.status = dto.status
        entity.spaceType = dto.spaceType
        entity.level = dto.level

        return parkingSpaceRepository.save(entity).toDTO()
    }

    @Transactional
    fun deleteParkingSpace(id: String) {
        if (!parkingSpaceRepository.existsById(id)) {
            throw NoSuchElementException("Parking space with id $id does not exist.")
        }
        parkingSpaceRepository.deleteById(id)
    }

    @Transactional(readOnly = true)
    fun getDetailedStats(): ParkingSpaceStatsDTO {
        val groupedCounts = parkingSpaceRepository.countByStatusGrouped()

        var free = 0L
        var occupied = 0L
        var reserved = 0L

        groupedCounts.forEach { row ->
            val status = row[0] as ParkingSpaceStatus
            val count = (row[1] as Number).toLong()

            when (status) {
                ParkingSpaceStatus.FREE -> free = count
                ParkingSpaceStatus.OCCUPIED -> occupied = count
                ParkingSpaceStatus.RESERVED -> reserved = count
            }
        }

        val total = free + occupied + reserved

        return ParkingSpaceStatsDTO(free, occupied, reserved, total)
    }


    @Transactional(readOnly = true)
    fun getSpaceDetails(id: String): ParkingSpotDetailsDTO {
        val space = parkingSpaceRepository.findById(id)
            .orElseThrow { NoSuchElementException("Parking space with id $id does not exist.") }

        var occupantDto: ParkingSpotOccupantDetailsDTO? = null

        if (space.status == ParkingSpaceStatus.OCCUPIED) {
            val activeHistory = parkingHistoryRepository.findByParkingSpaceIdAndEndTimeIsNull(id)

            if (activeHistory != null) {
                val vehicle = activeHistory.vehicle
                val owner = vehicle.owner

                // Obliczanie czasu trwania postoju w sekundach
                val duration = java.time.Duration.between(activeHistory.startTime, LocalDateTime.now())
                val durationInSeconds = duration.seconds

                val formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss")

                occupantDto = ParkingSpotOccupantDetailsDTO(
                    ownerId = owner.id.toString(),
                    ownerName = "${owner.name} ${owner.surname}",
                    ownerEmail = owner.email,
                    ownerPhone = "",
                    vehiclePlate = vehicle.licensePlate,
                    entryTime = activeHistory.startTime.format(formatter),
                    parkingDurationSec = durationInSeconds,
                    amountDue = 0.0,
                    imageUrl = activeHistory.photoPath
                )
            }
        }

        return ParkingSpotDetailsDTO(
            id = space.id,
            type = space.spaceType,
            status = space.status,
            level = space.level,
            occupant = occupantDto
        )
    }
}