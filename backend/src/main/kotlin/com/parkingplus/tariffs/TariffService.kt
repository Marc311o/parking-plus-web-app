package com.parkingplus.tariffs

import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TariffService(private val tariffRepository: TariffRepository) {

    @Transactional
    fun createTariff(dto: TariffDTO): TariffDTO {
        val existingTariffs = tariffRepository.findAll()

        val overlaps = existingTariffs.any { entity ->
            entity.dayOfWeek == dto.dayOfWeek &&
                    entity.isDaily == dto.isDaily &&
                    (dto.startHour < entity.endHour && dto.endHour > entity.startHour)
        }

        if (overlaps) {
            throw IllegalArgumentException("Tariff overlaps existing records!")
        }

        val entity = dto.toEntity()
        return tariffRepository.save(entity).toDTO()
    }

    @Transactional
    fun updateTariff(id: Long, dto: TariffDTO): TariffDTO {
        val existingTariff = tariffRepository.findById(id)
            .orElseThrow { NoSuchElementException("Tariff with ID: $id not found.") }

        val otherTariffs = tariffRepository.findAll().filter { it.id != id }

        val overlaps = otherTariffs.any { entity ->
            entity.dayOfWeek == dto.dayOfWeek &&
                    entity.isDaily == dto.isDaily &&
                    (dto.startHour < entity.endHour && dto.endHour > entity.startHour)
        }

        if (overlaps) {
            throw IllegalArgumentException("Tariff hours overlap existing records!")
        }

        existingTariff.apply {
             this.price = dto.price
        }


        val updatedEntity = TariffEntity(
            id = id,
            isDaily = dto.isDaily,
            dayOfWeek = dto.dayOfWeek,
            startHour = dto.startHour,
            endHour = dto.endHour,
            isFirstHour = dto.isFirstHour,
            price = dto.price
        )

        return tariffRepository.save(updatedEntity).toDTO()
    }

    @Transactional(readOnly = true)
    fun getAllTariffs(): List<TariffDTO> =
        tariffRepository.findAll().map { it.toDTO() }

    @Transactional
    fun deleteTariff(id: Long) {
        if (!tariffRepository.existsById(id)) throw NoSuchElementException("No tariff with id: $id")
        tariffRepository.deleteById(id)
    }
}