package com.parkingplus.parkinghistory

import com.parkingplus.parkingspaces.ParkingSpaceRepository
import com.parkingplus.parkingspaces.enums.SpaceType
import com.parkingplus.reservations.PricingService
import com.parkingplus.transactions.TransactionEntity
import com.parkingplus.transactions.TransactionRepository
import com.parkingplus.transactions.enums.TransactionType
import com.parkingplus.users.UserRepository
import com.parkingplus.vehicles.VehicleRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.DayOfWeek
import java.time.Duration
import java.time.format.DateTimeFormatter
import java.time.temporal.TemporalAdjusters
import kotlin.math.round

@Service
class ParkingHistoryService(
    private val parkingHistoryRepository: ParkingHistoryRepository,
    private val vehicleRepository: VehicleRepository,
    private val parkingSpaceRepository: ParkingSpaceRepository,
    private val pricingService: PricingService,
    private val userRepository: UserRepository,
    private val transactionRepository: TransactionRepository
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

        parkingSpace.status = com.parkingplus.parkingspaces.enums.ParkingSpaceStatus.OCCUPIED
        parkingSpaceRepository.save(parkingSpace)

        val entity = ParkingHistoryEntity(
            vehicle = vehicle,
            parkingSpace = parkingSpace,
            startTime = dto.startTime,
            endTime = dto.endTime,
            price = dto.price,
            barrierPhotoPath = dto.barrierPhotoPath.takeIf { !it.isNullOrBlank() } ?: run {
                val index = (vehicle.id ?: 0L) % 10
                "/car_photos/car_${index}_barrier.png"
            },
            spotPhotoPath = dto.spotPhotoPath.takeIf { !it.isNullOrBlank() } ?: run {
                val index = (vehicle.id ?: 0L) % 10
                "/car_photos/car_${index}_spot.png"
            }
        )

        return parkingHistoryRepository.save(entity).toDTO()
    }

    @Transactional
    fun checkoutIndefinite(historyId: Long, userId: Long): ParkingHistoryDTO {
        val entry = parkingHistoryRepository.findById(historyId)
            .orElseThrow { NoSuchElementException("Parking session with id $historyId not found") }

        if (entry.endTime != null) {
            throw IllegalArgumentException("Parking session is already closed")
        }

        val user = entry.vehicle.owner
        if (user.id != userId) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "This parking session does not belong to you")
        }

        var now = LocalDateTime.now()
        if (now.isBefore(entry.startTime) || now == entry.startTime) {
            now = entry.startTime.plusMinutes(1)
        }

        val price = pricingService.calculatePrice(entry.startTime, now)

        if (user.balance < price) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient funds. Required: $price, available: ${user.balance}")
        }

        // Deduct balance
        user.balance = user.balance.subtract(price)
        userRepository.save(user)

        // Record transaction
        transactionRepository.save(
            TransactionEntity(
                user = user,
                type = TransactionType.WITHDRAWAL,
                amount = price.toFloat(),
                realisedAt = now
            )
        )

        // End parking
        entry.endTime = now
        entry.price = price.toDouble()
        
        val parkingSpace = entry.parkingSpace
        parkingSpace.status = com.parkingplus.parkingspaces.enums.ParkingSpaceStatus.FREE
        parkingSpaceRepository.save(parkingSpace)

        return parkingHistoryRepository.save(entry).toDTO()
    }

    @Transactional(readOnly = true)
    fun calculateCurrentIndefiniteFee(historyId: Long): CheckoutDetailsDTO {
        val entry = parkingHistoryRepository.findById(historyId)
            .orElseThrow { NoSuchElementException("Parking session with id $historyId not found") }
        
        if (entry.endTime != null) {
            val durationMinutes = Duration.between(entry.startTime, entry.endTime).toMinutes()
            return CheckoutDetailsDTO(BigDecimal.valueOf(entry.price), entry.startTime, durationMinutes)
        }
        
        var now = LocalDateTime.now()
        if (now.isBefore(entry.startTime) || now == entry.startTime) {
            now = entry.startTime.plusMinutes(1)
        }
        
        val price = pricingService.calculatePrice(entry.startTime, now)
        val durationMinutes = Duration.between(entry.startTime, now).toMinutes()
        return CheckoutDetailsDTO(price, entry.startTime, durationMinutes)
    }

    @Transactional
    fun endParking(licensePlate: String): ParkingHistoryDTO {
        val activeParking = parkingHistoryRepository.findByVehicleLicensePlateAndEndTimeIsNull(licensePlate)
            ?: throw NoSuchElementException("No active parking entry found for vehicle $licensePlate")

        activeParking.endTime = LocalDateTime.now()
        //TODO: Calculate price based on parking tariffs and duration

        val parkingSpace = activeParking.parkingSpace
        parkingSpace.status = com.parkingplus.parkingspaces.enums.ParkingSpaceStatus.FREE
        parkingSpaceRepository.save(parkingSpace)

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
        val from: LocalDate
        val to: LocalDate

        val pointsMap = when (period) {
            AggregationPeriod.DAILY -> {
                from = date
                to = date
                val map = linkedMapOf<String, Long>()
                for (i in 0..22 step 2) map["$i:00"] = 0L
                map
            }
            AggregationPeriod.WEEKLY -> {
                from = date.with(DayOfWeek.MONDAY)
                to = date.with(DayOfWeek.SUNDAY)
                linkedMapOf("MON" to 0L, "TUE" to 0L, "WED" to 0L, "THU" to 0L, "FRI" to 0L, "SAT" to 0L, "SUN" to 0L)
            }
            AggregationPeriod.MONTHLY -> {
                from = date.withDayOfMonth(1)
                to = date.with(TemporalAdjusters.lastDayOfMonth())
                val map = linkedMapOf<String, Long>()
                for (d in 1..from.lengthOfMonth()) map[d.toString()] = 0L
                map
            }
            AggregationPeriod.YEARLY -> {
                from = date.withDayOfYear(1)
                to = date.withDayOfYear(date.lengthOfYear())
                linkedMapOf("JAN" to 0L, "FEB" to 0L, "MAR" to 0L, "APR" to 0L, "MAY" to 0L, "JUN" to 0L, "JUL" to 0L, "AUG" to 0L, "SEP" to 0L, "OCT" to 0L, "NOV" to 0L, "DEC" to 0L)
            }
        }

        val entries = parkingHistoryRepository.findStartTimesBetween(from.atStartOfDay(), to.atTime(LocalTime.MAX))
        entries.forEach { time ->
            val key = when (period) {
                AggregationPeriod.DAILY -> "${time.hour - (time.hour % 2)}:00"
                AggregationPeriod.WEEKLY -> time.dayOfWeek.name.substring(0, 3)
                AggregationPeriod.MONTHLY -> time.dayOfMonth.toString()
                AggregationPeriod.YEARLY -> time.month.name.substring(0, 3)
            }
            pointsMap[key] = (pointsMap[key] ?: 0L) + 1
        }

        return EntriesResponseDTO(period, from, to, entries.size.toLong(), pointsMap.map { EntriesPointDTO(it.key, it.value) })
    }

    @Transactional(readOnly = true)
    fun getRevenueStatistics(date: LocalDate, period: AggregationPeriod): RevenueStatsResponseDTO {
        val currentStart: LocalDate
        val currentEnd: LocalDate
        val previousStart: LocalDateTime
        val previousEnd: LocalDateTime

        val pointsMap = when (period) {
            AggregationPeriod.DAILY -> {
                currentStart = date
                currentEnd = date
                previousStart = currentStart.minusDays(1).atStartOfDay()
                previousEnd = currentStart.minusDays(1).atTime(LocalTime.MAX)
                val map = linkedMapOf<String, Double>()
                for (i in 0..22 step 2) map["$i:00"] = 0.0
                map
            }
            AggregationPeriod.WEEKLY -> {
                currentStart = date.with(DayOfWeek.MONDAY)
                currentEnd = date.with(DayOfWeek.SUNDAY)
                previousStart = currentStart.minusWeeks(1).atStartOfDay()
                previousEnd = currentEnd.minusWeeks(1).atTime(LocalTime.MAX)
                linkedMapOf("MON" to 0.0, "TUE" to 0.0, "WED" to 0.0, "THU" to 0.0, "FRI" to 0.0, "SAT" to 0.0, "SUN" to 0.0)
            }
            AggregationPeriod.MONTHLY -> {
                currentStart = date.withDayOfMonth(1)
                currentEnd = date.with(TemporalAdjusters.lastDayOfMonth())
                previousStart = currentStart.minusMonths(1).atStartOfDay()
                previousEnd = currentStart.minusMonths(1).with(TemporalAdjusters.lastDayOfMonth()).atTime(LocalTime.MAX)
                val map = linkedMapOf<String, Double>()
                for (d in 1..currentStart.lengthOfMonth()) map[d.toString()] = 0.0
                map
            }
            AggregationPeriod.YEARLY -> {
                currentStart = date.withDayOfYear(1)
                currentEnd = date.withDayOfYear(date.lengthOfYear())
                previousStart = currentStart.minusYears(1).atStartOfDay()
                previousEnd = currentEnd.minusYears(1).atTime(LocalTime.MAX)
                linkedMapOf("JAN" to 0.0, "FEB" to 0.0, "MAR" to 0.0, "APR" to 0.0, "MAY" to 0.0, "JUN" to 0.0, "JUL" to 0.0, "AUG" to 0.0, "SEP" to 0.0, "OCT" to 0.0, "NOV" to 0.0, "DEC" to 0.0)
            }
        }

        val currentData = parkingHistoryRepository.findRevenueBetween(currentStart.atStartOfDay(), currentEnd.atTime(LocalTime.MAX))
        val previousTotal = parkingHistoryRepository.sumPriceByEndTimeBetween(previousStart, previousEnd)
        var currentTotal = 0.0

        currentData.forEach {
            val key = when (period) {
                AggregationPeriod.DAILY -> "${it.endTime.hour - (it.endTime.hour % 2)}:00"
                AggregationPeriod.WEEKLY -> it.endTime.dayOfWeek.name.substring(0, 3)
                AggregationPeriod.MONTHLY -> it.endTime.dayOfMonth.toString()
                AggregationPeriod.YEARLY -> it.endTime.month.name.substring(0, 3)
            }
            pointsMap[key] = (pointsMap[key] ?: 0.0) + it.price
            currentTotal += it.price
        }

        val percentChange = if (previousTotal > 0.0) ((currentTotal - previousTotal) / previousTotal) * 100.0 else if (currentTotal > 0.0) 100.0 else 0.0

        return RevenueStatsResponseDTO(
            period = period, from = currentStart, to = currentEnd, total = round(currentTotal * 100) / 100.0,
            previousPeriodChangePercent = round(percentChange * 10) / 10.0, currency = "PLN",
            points = pointsMap.map { RevenuePointDTO(it.key, round(it.value * 100) / 100.0) }
        )
    }

    @Transactional(readOnly = true)
    fun getAverageStayStatistics(date: LocalDate, period: AggregationPeriod): AverageStayResponseDTO {
        val from: LocalDate
        val to: LocalDate

        when (period) {
            AggregationPeriod.DAILY -> { from = date; to = date }
            AggregationPeriod.WEEKLY -> { from = date.with(DayOfWeek.MONDAY); to = date.with(DayOfWeek.SUNDAY) }
            AggregationPeriod.MONTHLY -> { from = date.withDayOfMonth(1); to = date.with(TemporalAdjusters.lastDayOfMonth()) }
            AggregationPeriod.YEARLY -> { from = date.withDayOfYear(1); to = date.withDayOfYear(date.lengthOfYear()) }
        }

        val stays = parkingHistoryRepository.findCompletedStaysBetween(from.atStartOfDay(), to.atTime(LocalTime.MAX))
        var totalMinutesOverall = 0L
        var validStayCount = 0L
        val typeTotalMinutes = mutableMapOf<SpaceType, Long>()
        val typeCounts = mutableMapOf<SpaceType, Int>()

        stays.forEach { stay ->
            if (stay.endTime.isAfter(stay.startTime)) {
                val minutes = Duration.between(stay.startTime, stay.endTime).toMinutes()
                totalMinutesOverall += minutes
                validStayCount++
                typeTotalMinutes[stay.spaceType] = (typeTotalMinutes[stay.spaceType] ?: 0L) + minutes
                typeCounts[stay.spaceType] = (typeCounts[stay.spaceType] ?: 0) + 1
            }
        }

        val overallAverage = if (validStayCount > 0) totalMinutesOverall / validStayCount else 0L
        val categories = typeTotalMinutes.entries.sortedBy { it.key.name }.map { (type, total) ->
            val count = typeCounts[type] ?: 0
            AverageStayCategoryItemDTO(type, if (count > 0) total / count else 0L)
        }

        return AverageStayResponseDTO(period, from, to, overallAverage, categories)
    }

    @Transactional(readOnly = true)
    fun getSpaceRanking(date: LocalDate, period: AggregationPeriod, floor: ParkingFloor): ParkingSpaceRankingResponseDTO {
        val from: LocalDate
        val to: LocalDate

        when (period) {
            AggregationPeriod.DAILY -> { from = date; to = date }
            AggregationPeriod.WEEKLY -> { from = date.with(DayOfWeek.MONDAY); to = date.with(DayOfWeek.SUNDAY) }
            AggregationPeriod.MONTHLY -> { from = date.withDayOfMonth(1); to = date.with(TemporalAdjusters.lastDayOfMonth()) }
            AggregationPeriod.YEARLY -> { from = date.withDayOfYear(1); to = date.withDayOfYear(date.lengthOfYear()) }
        }

        val rankingData = parkingHistoryRepository.findSpaceRankingForLevelAndDate(
            level = floor.level,
            start = from.atStartOfDay(),
            end = to.atTime(LocalTime.MAX)
        )

        val totalEntries = rankingData.sumOf { it.usageCount }
        val points = rankingData.map { ParkingSpaceRankingPointDTO(it.spaceId, it.usageCount) }

        return ParkingSpaceRankingResponseDTO(floor, period, from, to, totalEntries, points)
    }

    @Transactional(readOnly = true)
    fun getParkingEvents(): List<ParkingEventDTO> {
        val history = parkingHistoryRepository.findAllWithVehicleAndOwner()
        val events = mutableListOf<ParkingEventDTO>()

        for (entry in history) {
            val owner = entry.vehicle.owner
            val entryId = entry.id ?: continue

            events.add(ParkingEventDTO(entryId * 10, entry.vehicle.licensePlate, ParkingEventType.ENTRY, entry.startTime, owner.name, owner.surname, owner.email, entry.barrierPhotoPath, entry.spotPhotoPath))
            if (entry.endTime != null) {
                events.add(ParkingEventDTO(entryId * 10 + 1, entry.vehicle.licensePlate, ParkingEventType.EXIT, entry.endTime!!, owner.name, owner.surname, owner.email, entry.barrierPhotoPath, entry.spotPhotoPath))
            }
        }

        return events.sortedByDescending { it.eventDate }
    }
}