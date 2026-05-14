package com.parkingplus.reservations

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/reservations")
class ReservationController(
    private val pricingService: PricingService,
    private val reservationService: ReservationService
) {

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/quote")
    fun getQuote(
        @RequestBody request: ParkingPurchaseRequestDTO,
        authentication: Authentication
    ): ResponseEntity<ParkingQuoteDTO> {
        val authUserId = extractUserId(authentication)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val quote = pricingService.calculateQuote(request, authUserId)
        return ResponseEntity.ok(quote)
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/purchase")
    fun purchase(
        @RequestBody request: ParkingPurchaseRequestDTO,
        authentication: Authentication
    ): ResponseEntity<ParkingPurchaseDTO> {
        val authUserId = extractUserId(authentication)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        return try {
            val result = reservationService.purchaseOrReserve(request, authUserId)
            ResponseEntity.ok(result)
        } catch (e: IllegalStateException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    private fun extractUserId(authentication: Authentication): Long? {
        return when (val details = authentication.details) {
            is Long -> details
            is Number -> details.toLong()
            is String -> details.toLongOrNull()
            else -> null
        }
    }
}
