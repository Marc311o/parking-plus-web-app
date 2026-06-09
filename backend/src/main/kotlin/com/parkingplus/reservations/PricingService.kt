package com.parkingplus.reservations

import com.parkingplus.tariffs.TariffRepository
import com.parkingplus.users.UserRepository
import com.parkingplus.vehicles.VehicleRepository
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.Duration
import java.time.LocalDateTime

@Service
class PricingService(
    private val tariffRepository: TariffRepository,
    private val userRepository: UserRepository,
    private val vehicleRepository: VehicleRepository
) {

    fun calculateQuote(request: ParkingPurchaseRequestDTO, userId: Long, isAdmin: Boolean = false): ParkingQuoteDTO {
        val price = if (request.mode == ParkingPurchaseMode.INDEFINITE) {
            BigDecimal.ZERO
        } else {
            calculatePrice(request.startTime, request.endTime ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "End time is required for this mode"))
        }
        
        val balanceToUse = if (request.vehicleId != null) {
            val vehicle = vehicleRepository.findById(request.vehicleId).orElseThrow {
                ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle with id ${request.vehicleId} not found")
            }
            if (!isAdmin && vehicle.owner.id != userId) {
                throw ResponseStatusException(HttpStatus.FORBIDDEN, "Vehicle with id ${request.vehicleId} does not belong to user $userId")
            }
            vehicle.owner.balance
        } else {
            val user = userRepository.findById(userId).orElseThrow {
                ResponseStatusException(HttpStatus.NOT_FOUND, "User with id $userId not found")
            }
            user.balance
        }
        
        val balanceAfter = balanceToUse.subtract(price)
        
        return ParkingQuoteDTO(
            price = price,
            balanceAfter = balanceAfter
        )
    }

    fun calculatePrice(start: LocalDateTime, end: LocalDateTime): BigDecimal {
        if (!end.isAfter(start)) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time")
        }

        val allTariffs = tariffRepository.findAll()
        val dailyTariffsByDay = allTariffs
            .filter { it.isDaily }
            .associateBy { it.dayOfWeek }

        val hourlyTariffsByDayAndHour = allTariffs
            .filter { !it.isDaily }
            .flatMap { tariff ->
                (tariff.startHour until tariff.endHour).map { hour ->
                    (tariff.dayOfWeek to hour) to tariff
                }
            }
            .groupBy({ it.first }, { it.second })

        var totalFinalPrice = BigDecimal.ZERO
        var currentDateTime = start
        var totalHoursCount = 0

        // Iterate through calendar days
        while (currentDateTime.isBefore(end)) {
            val currentLocalDate = currentDateTime.toLocalDate()
            val endOfCurrentDay = currentLocalDate.plusDays(1).atStartOfDay()
            val segmentEnd = if (end.isBefore(endOfCurrentDay)) end else endOfCurrentDay

            // Calculate duration in minutes for this segment and convert to hours (ceiling)
            val segmentDurationMinutes = Duration.between(currentDateTime, segmentEnd).toMinutes()
            if (segmentDurationMinutes < 1 && currentDateTime == start) {
                // Handle very short first segment if needed, though usually at least 1 min
            }
            
            val segmentHours = Math.ceil(segmentDurationMinutes / 60.0).toInt().coerceAtLeast(if (currentDateTime == start) 1 else 0)

            var segmentCost = BigDecimal.ZERO
            var segmentIterateTime = currentDateTime

            for (h in 0 until segmentHours) {
                val hourOfDay = segmentIterateTime.hour
                val isFirstHourOfSession = (totalHoursCount == 0)
                val hourlyTariffs = hourlyTariffsByDayAndHour[segmentIterateTime.dayOfWeek.value to hourOfDay].orEmpty()

                val tariff = if (isFirstHourOfSession) {
                    hourlyTariffs.find { it.isFirstHour } ?: hourlyTariffs.find { !it.isFirstHour }
                } else {
                    hourlyTariffs.find { !it.isFirstHour } ?: hourlyTariffs.find { it.isFirstHour }
                }

                val priceToAdd = if (tariff != null) BigDecimal.valueOf(tariff.price) else BigDecimal.valueOf(5.0)
                segmentCost = segmentCost.add(priceToAdd)
                
                segmentIterateTime = segmentIterateTime.plusHours(1)
                totalHoursCount++
            }

            // Apply Daily Cap for the current day
            val dailyTariff = dailyTariffsByDay[currentLocalDate.dayOfWeek.value]
            if (dailyTariff != null) {
                val dailyLimit = BigDecimal.valueOf(dailyTariff.price)
                totalFinalPrice = totalFinalPrice.add(if (segmentCost > dailyLimit) dailyLimit else segmentCost)
            } else {
                totalFinalPrice = totalFinalPrice.add(segmentCost)
            }

            // Move to the start of the next day
            currentDateTime = segmentEnd
        }

        return totalFinalPrice.setScale(2, RoundingMode.HALF_UP)
    }
}

data class ParkingPurchaseRequestDTO(
    val vehicleId: Long?,
    val mode: ParkingPurchaseMode,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime?,
    val durationMinutes: Int? = null
)

data class ParkingQuoteDTO(
    val price: BigDecimal,
    val balanceAfter: BigDecimal,
    val currency: String = "PLN"
)
