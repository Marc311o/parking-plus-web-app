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
        if (end.isBefore(start)) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "End time must be after start time")
        }

        var durationMinutes = Duration.between(start, end).toMinutes()
        if (durationMinutes < 1) {
            durationMinutes = 1
        }
        val durationHours = Math.ceil(durationMinutes / 60.0).toInt().coerceAtLeast(1)

        val tariffs = tariffRepository.findAll()
        val dailyTariffsByDay = tariffs
            .asSequence()
            .filter { it.isDaily }
            .groupBy { it.dayOfWeek }
        val hourlyTariffsByDayAndHour = tariffs
            .asSequence()
            .filter { !it.isDaily }
            .flatMap { tariff ->
                (tariff.startHour until tariff.endHour).asSequence().map { hour ->
                    Triple(tariff.dayOfWeek, hour, tariff)
                }
            }
            .groupBy({ (tariffDayOfWeek, hour, _) -> tariffDayOfWeek to hour }, { (_, _, tariff) -> tariff })

        var totalCost = BigDecimal.ZERO
        var currentHour = start

        for (h in 0 until durationHours) {
            val hourOfDay = currentHour.hour
            val isFirstHour = (h == 0)
            val hourlyTariffs = hourlyTariffsByDayAndHour[currentHour.dayOfWeek.value to hourOfDay].orEmpty()

            val tariff = if (isFirstHour) {
                hourlyTariffs.find { it.isFirstHour } ?: hourlyTariffs.find { !it.isFirstHour }
            } else {
                hourlyTariffs.find { !it.isFirstHour } ?: hourlyTariffs.find { it.isFirstHour }
            }

            val priceToAdd = if (tariff != null) BigDecimal.valueOf(tariff.price) else BigDecimal.valueOf(5.0)
            totalCost = totalCost.add(priceToAdd)
            currentHour = currentHour.plusHours(1)
        }

        // Check if daily cap applies (for the start day)
        val dailyTariff = dailyTariffsByDay[start.dayOfWeek.value]?.firstOrNull()
        val finalPrice = if (dailyTariff != null) {
            val dailyPrice = BigDecimal.valueOf(dailyTariff.price)
            if (totalCost > dailyPrice) dailyPrice else totalCost
        } else {
            totalCost
        }

        return finalPrice.setScale(2, RoundingMode.HALF_UP)
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
