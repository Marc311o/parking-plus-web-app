package com.parkingplus.parkinghistory

import com.parkingplus.parkingspaces.ParkingSpaceRepository
import com.parkingplus.vehicles.VehicleRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.DayOfWeek
import java.time.format.DateTimeFormatter

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

    @Transactional(readOnly = true)
    fun getEntriesStatistics(date: LocalDate, period: AggregationPeriod): EntriesResponseDTO {

        return when (period) {
            AggregationPeriod.WEEKLY -> {
                val startOfWeek = date.with(DayOfWeek.MONDAY)
                val endOfWeek = date.with(DayOfWeek.SUNDAY)


                val entryTimes = parkingHistoryRepository.findStartTimesBetween(
                    startOfWeek.atStartOfDay(),
                    endOfWeek.atTime(LocalTime.MAX)
                )

                val pointsMap = linkedMapOf(
                    "MON" to 0L,
                    "TUE" to 0L,
                    "WED" to 0L,
                    "THU" to 0L,
                    "FRI" to 0L,
                    "SAT" to 0L,
                    "SUN" to 0L
                )

                entryTimes.forEach { time ->
                    val day = time.dayOfWeek.name.substring(0, 3)
                    pointsMap[day] = pointsMap.getOrDefault(day, 0) + 1
                }

                EntriesResponseDTO(
                    period = period,
                    from = startOfWeek,
                    to = endOfWeek,
                    total = entryTimes.size.toLong(),
                    points = pointsMap.map { EntriesPointDTO(it.key, it.value) }
                )
            }

            AggregationPeriod.DAILY -> {
                val entryTimes = parkingHistoryRepository.findStartTimesBetween(
                    date.atStartOfDay(),
                    date.atTime(LocalTime.MAX)
                )

                val pointsMap = linkedMapOf<String, Long>()
                for (i in 0..22 step 2) {
                    pointsMap["$i:00"] = 0L
                }

                entryTimes.forEach { time ->
                    val hour = time.hour
                    val bucket = hour - (hour % 2)
                    pointsMap["$bucket:00"] = pointsMap.getOrDefault("$bucket:00", 0) + 1
                }

                EntriesResponseDTO(
                    period = period,
                    from = date,
                    to = date,
                    total = entryTimes.size.toLong(),
                    points = pointsMap.map { EntriesPointDTO(it.key, it.value) }
                )
            }

            AggregationPeriod.YEARLY -> {
                val startOfYear = date.withDayOfYear(1)
                val endOfYear = date.withDayOfYear(date.lengthOfYear())

                val entryTimes = parkingHistoryRepository.findStartTimesBetween(
                    startOfYear.atStartOfDay(),
                    endOfYear.atTime(LocalTime.MAX)
                )

                val pointsMap = linkedMapOf(
                    "JAN" to 0L,
                    "FEB" to 0L,
                    "MAR" to 0L,
                    "APR" to 0L,
                    "MAY" to 0L,
                    "JUN" to 0L,
                    "JUL" to 0L,
                    "AUG" to 0L,
                    "SEP" to 0L,
                    "OCT" to 0L,
                    "NOV" to 0L,
                    "DEC" to 0L
                )

                entryTimes.forEach { time ->
                    val month = time.month.name.substring(0, 3)
                    pointsMap[month] = pointsMap.getOrDefault(month, 0) + 1
                }

                EntriesResponseDTO(
                    period = period,
                    from = startOfYear,
                    to = endOfYear,
                    total = entryTimes.size.toLong(),
                    points = pointsMap.map { EntriesPointDTO(it.key, it.value) }
                )
            }
        }
    }
}