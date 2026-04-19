package com.parkingplus.parkingspaces

import com.parkingplus.parkingspaces.enums.ParkingSpaceStatus
import com.parkingplus.parkingspaces.enums.SpaceType
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.NoSuchElementException

@Service
class ParkingSpaceService(
    private val parkingSpaceRepository: ParkingSpaceRepository
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
}