package com.parkingplus.reservations

import com.parkingplus.parkinghistory.ParkingHistoryEntity
import com.parkingplus.parkinghistory.ParkingHistoryRepository
import com.parkingplus.parkingspaces.ParkingSpaceDTO
import com.parkingplus.parkingspaces.ParkingSpaceRepository
import com.parkingplus.parkingspaces.enums.ParkingSpaceStatus
import com.parkingplus.parkingspaces.toDTO
import com.parkingplus.transactions.TransactionEntity
import com.parkingplus.transactions.TransactionRepository
import com.parkingplus.transactions.enums.TransactionType
import com.parkingplus.users.UserRepository
import com.parkingplus.vehicles.VehicleRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.LocalDateTime

@Service
class ReservationService(
    private val reservationRepository: ReservationRepository,
    private val parkingSpaceRepository: ParkingSpaceRepository,
    private val parkingHistoryRepository: ParkingHistoryRepository,
    private val vehicleRepository: VehicleRepository,
    private val userRepository: UserRepository,
    private val transactionRepository: TransactionRepository,
    private val pricingService: PricingService
) {

    @Transactional
    fun purchaseOrReserve(request: ParkingPurchaseRequestDTO, userId: Long): ParkingPurchaseDTO {
        val vehicleId = request.vehicleId ?: throw IllegalArgumentException("Vehicle ID is required")
        val vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow { NoSuchElementException("Vehicle with id $vehicleId not found") }

        val user = vehicle.owner
        val startTime = if (request.mode == "PURCHASE") LocalDateTime.now() else request.startTime
        val endTime = request.endTime

        if (endTime.isBefore(startTime)) {
            throw IllegalArgumentException("End time must be after start time")
        }

        val price = pricingService.calculatePrice(startTime, endTime)

        if (user.balance < price) {
            throw IllegalStateException("Insufficient funds. Required: $price, available: ${user.balance}")
        }

        val allFreeSpaces = parkingSpaceRepository.findAllByStatus(ParkingSpaceStatus.FREE)
        if (allFreeSpaces.isEmpty()) {
            throw IllegalStateException("No available parking spaces")
        }

        val prioritySpaces = allFreeSpaces.filter { space ->
            when (vehicle.carType) {
                com.parkingplus.vehicles.enums.CarType.EV_HANDICAPED ->
                    space.spaceType == com.parkingplus.parkingspaces.enums.SpaceType.EV_HANDICAPED ||
                            space.spaceType == com.parkingplus.parkingspaces.enums.SpaceType.EV_BOTH

                com.parkingplus.vehicles.enums.CarType.EV_ABLEBODIED ->
                    space.spaceType == com.parkingplus.parkingspaces.enums.SpaceType.EV_ABLEBODIED

                com.parkingplus.vehicles.enums.CarType.REGULAR_HANDICAPED ->
                    space.spaceType == com.parkingplus.parkingspaces.enums.SpaceType.REGULAR_HANDICAPED ||
                            space.spaceType == com.parkingplus.parkingspaces.enums.SpaceType.REGULAR_BOTH

                else -> false
            }
        }

        // If priority spaces exist, pick one randomly. 
        // Otherwise, pick from available non-handicapped spaces if the vehicle is not eligible for handicapped spots.
        val availableSpace = if (prioritySpaces.isNotEmpty()) {
            prioritySpaces.shuffled().first()
        } else {
            // Fallback: If no priority space, pick a random free space.
            // BUT: if it's an able-bodied person (regular or EV), avoid handicapped spaces even in fallback if possible.
            val isEligibleForHandicapped = vehicle.carType == com.parkingplus.vehicles.enums.CarType.EV_HANDICAPED ||
                    vehicle.carType == com.parkingplus.vehicles.enums.CarType.REGULAR_HANDICAPED

            val fallbackPool = if (!isEligibleForHandicapped) {
                val nonHandicappedSpaces = allFreeSpaces.filter {
                    it.spaceType != com.parkingplus.parkingspaces.enums.SpaceType.REGULAR_HANDICAPED &&
                            it.spaceType != com.parkingplus.parkingspaces.enums.SpaceType.EV_HANDICAPED &&
                            it.spaceType != com.parkingplus.parkingspaces.enums.SpaceType.REGULAR_BOTH &&
                            it.spaceType != com.parkingplus.parkingspaces.enums.SpaceType.EV_BOTH
                }
                if (nonHandicappedSpaces.isNotEmpty()) nonHandicappedSpaces else allFreeSpaces
            } else {
                allFreeSpaces
            }

            fallbackPool.shuffled().first()
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
                realisedAt = LocalDateTime.now()
            )
        )

        val id: Long
        if (request.mode == "PURCHASE") {
            availableSpace.status = ParkingSpaceStatus.OCCUPIED
            parkingSpaceRepository.save(availableSpace)

            val history = parkingHistoryRepository.save(
                ParkingHistoryEntity(
                    vehicle = vehicle,
                    parkingSpace = availableSpace,
                    startTime = startTime,
                    endTime = null, // Still occupied
                    price = price.toDouble(),
                    photoPath = "/photos/placeholder.jpg"
                )
            )
            id = history.id ?: 0L
        } else {
            // Future reservation
            // For now, we just mark the space as RESERVED if it's a reservation starting soon,
            availableSpace.status = ParkingSpaceStatus.RESERVED
            parkingSpaceRepository.save(availableSpace)

            val reservation = reservationRepository.save(
                ReservationEntity(
                    user = user,
                    vehicle = vehicle,
                    parkingSpace = availableSpace,
                    startTime = startTime,
                    endTime = endTime,
                    price = price,
                    status = ReservationStatus.CONFIRMED
                )
            )
            id = reservation.id ?: 0L
        }

        return ParkingPurchaseDTO(
            id = id,
            vehicleId = vehicleId,
            licensePlate = vehicle.licensePlate,
            mode = request.mode,
            parkingSpace = availableSpace.toDTO(),
            startTime = startTime,
            endTime = endTime,
            price = price,
            balanceAfter = user.balance
        )
    }
}

data class ParkingPurchaseDTO(
    val id: Long,
    val vehicleId: Long,
    val licensePlate: String,
    val mode: String,
    val parkingSpace: ParkingSpaceDTO,
    val startTime: LocalDateTime,
    val endTime: LocalDateTime,
    val price: BigDecimal,
    val balanceAfter: BigDecimal,
    val currency: String = "PLN"
)
