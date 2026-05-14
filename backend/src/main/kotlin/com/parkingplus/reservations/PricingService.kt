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
        val dailyTariff = tariffs.find { it.isDaily && it.dayOfWeek == dayOfWeek }

        var totalCost = 0.0
        var currentHour = start

        for (h in 0 until durationHours) {
            val hourOfDay = currentHour.hour
            val isFirstHour = (h == 0)

            val tariff = tariffs.find {
                !it.isDaily &&
                        it.dayOfWeek == currentHour.dayOfWeek.value &&
                        hourOfDay >= it.startHour && hourOfDay < it.endHour &&
                        (it.isFirstHour == isFirstHour || !it.isFirstHour)
            }
                ?: tariffs.find { !it.isDaily && it.dayOfWeek == currentHour.dayOfWeek.value && hourOfDay >= it.startHour && hourOfDay < it.endHour }

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
