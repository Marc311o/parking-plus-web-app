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
        return vehicleRepository.findAllByOwnerIdAndIsActiveTrue(ownerId).map { it.toDTO() }
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
        val existingVehicle = vehicleRepository.findByLicensePlate(dto.licensePlate)

        if (existingVehicle != null) {
            if (existingVehicle.owner.id == dto.ownerId) {
                if (!existingVehicle.isActive) {
                    existingVehicle.isActive = true
                    existingVehicle.carType = dto.carType
                    return vehicleRepository.save(existingVehicle).toDTO()
                } else {
                    throw IllegalArgumentException("Car with license plate ${dto.licensePlate} already exists.")
                }
            } else {
                throw IllegalArgumentException("Car with license plate ${dto.licensePlate} is already registered to another user.")
            }
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
        val vehicle = vehicleRepository.findById(id)
            .orElseThrow { NoSuchElementException("Vehicle with $id does not exist.") }
        
        vehicle.isActive = false
        vehicleRepository.save(vehicle)
    }

    @Transactional(readOnly = true)
    fun getAllVehicles(): List<VehicleDTO> {
        return vehicleRepository.findAll().map { it.toDTO() }
    }

    @Transactional
    fun updateVehicle(id: Long, dto: UpdateVehicleDTO): VehicleDTO {

        val vehicle = vehicleRepository.findById(id)
            .orElseThrow {
                NoSuchElementException("Vehicle with id $id does not exist.")
            }

        if (
            vehicle.licensePlate != dto.licensePlate &&
            vehicleRepository.existsByLicensePlate(dto.licensePlate)
        ) {
            throw IllegalArgumentException(
                "Car with license plate ${dto.licensePlate} already exists."
            )
        }

        vehicle.licensePlate = dto.licensePlate
        vehicle.carType = dto.carType

        return vehicle.toDTO()
    }
}
