package com.parkingplus.reservations

import com.parkingplus.tariffs.TariffRepository
import com.parkingplus.users.UserRepository
import com.parkingplus.vehicles.VehicleRepository
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.Duration
import java.time.LocalDateTime
import java.time.ZoneOffset

@Service
class PricingService(
    private val tariffRepository: TariffRepository,
    private val userRepository: UserRepository,
    private val vehicleRepository: VehicleRepository
) {

    fun calculateQuote(request: ParkingPurchaseRequestDTO, userId: Long): ParkingQuoteDTO {
        val price = calculatePrice(request.startTime, request.endTime)
        
        val balanceToUse = if (request.vehicleId != null) {
            val vehicle = vehicleRepository.findById(request.vehicleId).orElseThrow {
                NoSuchElementException("Vehicle with id ${request.vehicleId} not found")
            }
            if (vehicle.owner.id != userId) {
                throw IllegalArgumentException("Vehicle with id ${request.vehicleId} does not belong to user $userId")
            }
            vehicle.owner.balance
        } else {
            val user = userRepository.findById(userId).orElseThrow {
                NoSuchElementException("User with id $userId not found")
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
        val durationMinutes = Duration.between(start, end).toMinutes()
        val durationHours = Math.ceil(durationMinutes / 60.0).toInt().coerceAtLeast(1)
        val dayOfWeek = start.dayOfWeek.value

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

        val dailyTariff = dailyTariffsByDay[dayOfWeek]?.firstOrNull()

        var totalCost = 0.0
        var currentHour = start

        for (h in 0 until durationHours) {
            val hourOfDay = currentHour.hour
            val isFirstHour = (h == 0)
            val hourlyTariffs = hourlyTariffsByDayAndHour[currentHour.dayOfWeek.value to hourOfDay].orEmpty()

            val tariff = hourlyTariffs.firstOrNull {
                it.isFirstHour == isFirstHour || !it.isFirstHour
            } ?: hourlyTariffs.firstOrNull()

            totalCost += tariff?.price ?: 5.0
            currentHour = currentHour.plusHours(1)
        }

        val finalPrice = if (dailyTariff != null && totalCost > dailyTariff.price) dailyTariff.price else totalCost
        return BigDecimal.valueOf(finalPrice)
    }
}

data class ParkingPurchaseRequestDTO(
    val vehicleId: Long?,
    val mode: String, // 'PURCHASE' | 'RESERVATION'
    val startTime: LocalDateTime,
    val endTime: LocalDateTime,
    val durationMinutes: Int? = null
)

data class ParkingQuoteDTO(
    val price: BigDecimal,
    val balanceAfter: BigDecimal,
    val currency: String = "PLN"
)
