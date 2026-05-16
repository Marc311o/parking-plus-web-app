package com.parkingplus.reservations

import com.parkingplus.parkinghistory.ParkingHistoryEntity
import com.parkingplus.parkinghistory.ParkingHistoryRepository
import com.parkingplus.parkingspaces.ParkingSpaceDTO
import com.parkingplus.parkingspaces.ParkingSpaceRepository
import com.parkingplus.parkingspaces.enums.ParkingSpaceStatus
import com.parkingplus.parkingspaces.enums.SpaceType
import com.parkingplus.parkingspaces.toDTO
import com.parkingplus.transactions.TransactionEntity
import com.parkingplus.transactions.TransactionRepository
import com.parkingplus.transactions.enums.TransactionType
import com.parkingplus.users.UserRepository
import com.parkingplus.vehicles.VehicleRepository
import com.parkingplus.vehicles.enums.CarType
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException
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
    fun purchaseOrReserve(request: ParkingPurchaseRequestDTO, userId: Long, isAdmin: Boolean = false): ParkingPurchaseDTO {
        val vehicleId = request.vehicleId ?: throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Vehicle ID is required")
        val vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow { ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle with id $vehicleId not found") }
        
        // Security: Verify ownership or admin override
        if (!isAdmin && vehicle.owner.id != userId) {
            throw ResponseStatusException(HttpStatus.FORBIDDEN, "Vehicle with id $vehicleId does not belong to user $userId")
        }

        // Duplicate Check: Ensure vehicle doesn't already have an active stay
        if (parkingHistoryRepository.existsByVehicleIdAndEndTimeIsNull(vehicleId)) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "Vehicle already has an active parking stay")
        }
        
        val user = vehicle.owner
        val duration = java.time.Duration.between(request.startTime, request.endTime)
        val startTime = if (request.mode == ParkingPurchaseMode.PURCHASE) LocalDateTime.now() else request.startTime
        val endTime = if (request.mode == ParkingPurchaseMode.PURCHASE) startTime.plus(duration) else request.endTime

        val price = pricingService.calculatePrice(startTime, endTime)
        
        if (user.balance < price) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient funds. Required: $price, available: ${user.balance}")
        }

        // Find available parking spaces with pessimistic lock for atomicity
        val allFreeSpaces = parkingSpaceRepository.findAllByStatusWithLock(ParkingSpaceStatus.FREE)
        
        // Filter out spaces that have overlapping reservations
        val trulyAvailableSpaces = allFreeSpaces.filter { space ->
            reservationRepository.findOverlappingReservations(space.id, startTime, endTime).isEmpty()
        }

        if (trulyAvailableSpaces.isEmpty()) {
            throw ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "No available parking spaces for the selected time range")
        }

        // SMART ALLOCATION LOGIC
        
        // 1. Priority search: EV or handicapped spots based on vehicle type
        val prioritySpaces = trulyAvailableSpaces.filter { space ->
            when (vehicle.carType) {
                CarType.EV_HANDICAPED -> 
                    space.spaceType == SpaceType.EV_HANDICAPED || 
                    space.spaceType == SpaceType.EV_BOTH
                
                CarType.EV_ABLEBODIED -> 
                    space.spaceType == SpaceType.EV_ABLEBODIED
                
                CarType.REGULAR_HANDICAPED -> 
                    space.spaceType == SpaceType.REGULAR_HANDICAPED || 
                    space.spaceType == SpaceType.REGULAR_BOTH
                
                else -> false
            }
        }

        // 2. randomized selection if priority spots exist
        val availableSpace = if (prioritySpaces.isNotEmpty()) {
            prioritySpaces.shuffled().first()
        } else {
            // 3. Intelligent Fallback: pick a general spot, but strictly avoid handicapped spots for non-eligible users
            val isEligibleForHandicapped = vehicle.carType == CarType.EV_HANDICAPED || 
                                           vehicle.carType == CarType.REGULAR_HANDICAPED
            
            val fallbackPool = if (!isEligibleForHandicapped) {
                trulyAvailableSpaces.filter { 
                    it.spaceType != SpaceType.REGULAR_HANDICAPED &&
                    it.spaceType != SpaceType.EV_HANDICAPED &&
                    it.spaceType != SpaceType.REGULAR_BOTH &&
                    it.spaceType != SpaceType.EV_BOTH
                }
            } else {
                trulyAvailableSpaces
            }

            if (fallbackPool.isEmpty()) {
                throw ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "No suitable parking spaces available for this vehicle type")
            }
            
            fallbackPool.shuffled().first()
        }

        // TRANSACTION INTEGRATION (Atomic Operation)
        
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
        if (request.mode == ParkingPurchaseMode.PURCHASE) {
            availableSpace.status = ParkingSpaceStatus.OCCUPIED
            parkingSpaceRepository.save(availableSpace)

            val history = parkingHistoryRepository.save(
                ParkingHistoryEntity(
                    vehicle = vehicle,
                    parkingSpace = availableSpace,
                    startTime = startTime,
                    endTime = endTime, // Persist planned end time
                    price = price.toDouble(),
                    photoPath = "/photos/placeholder.jpg"
                )
            )
            id = history.id ?: throw IllegalStateException("Failed to save parking history ID")
        } else {
            // Reservations DO NOT change immediate space status to OCCUPIED
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
            id = reservation.id ?: throw IllegalStateException("Failed to save reservation ID")
        }

        return ParkingPurchaseDTO(
            id = id,
            vehicleId = vehicleId,
            licensePlate = vehicle.licensePlate,
            mode = request.mode.name,
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
