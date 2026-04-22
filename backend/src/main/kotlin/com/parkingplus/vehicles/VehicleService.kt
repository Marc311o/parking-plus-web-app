package com.parkingplus.vehicles

import com.parkingplus.users.UserRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class VehicleService(
    private val vehicleRepository: VehicleRepository,
    private val userRepository: UserRepository
) {
    @Transactional(readOnly = true)
    fun getAllVehiclesByOwner(ownerId: Long): List<VehicleDTO> {
        return vehicleRepository.findAllByOwnerId(ownerId).map { it.toDTO() }
    }

    @Transactional(readOnly = true)
    fun getVehicleByPlate(plate: String): VehicleDTO? {
        return vehicleRepository.findByLicensePlate(plate)?.toDTO()
    }

    @Transactional(readOnly = true)
    fun getVehicleById(id: Long): VehicleDTO? {
        return vehicleRepository.findById(id).map { it.toDTO() }.orElse(null)
    }

    @Transactional
    fun createVehicle(dto: VehicleDTO): VehicleDTO {
        if (vehicleRepository.existsByLicensePlate(dto.licensePlate)) {
            throw IllegalArgumentException("Car with license plate ${dto.licensePlate} already exists.")
        }

        val owner = userRepository.findById(dto.ownerId)
            .orElseThrow { throw NoSuchElementException("Could not find user with id ${dto.ownerId}") }

        val entity = VehicleEntity(
            licensePlate = dto.licensePlate,
            owner = owner,
            carType = dto.carType
        )

        return vehicleRepository.save(entity).toDTO()
    }

    @Transactional
    fun deleteVehicle(id: Long) {
        if (!vehicleRepository.existsById(id)) {
            throw NoSuchElementException("Vehicle with $id does not exist.")
        }
        vehicleRepository.deleteById(id)
    }

    @Transactional(readOnly = true)
    fun getAllVehicles(): List<VehicleDTO> {
        return vehicleRepository.findAll().map { it.toDTO() }
    }
}
