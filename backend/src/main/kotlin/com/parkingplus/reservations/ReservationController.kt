package com.parkingplus.reservations

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/reservations")
class ReservationController(
    private val pricingService: PricingService
) {

    @PreAuthorize("hasAnyRole('ADMIN','CLIENT')")
    @PostMapping("/quote")
    fun getQuote(
        @RequestBody request: ParkingPurchaseRequestDTO,
        authentication: Authentication
    ): ResponseEntity<ParkingQuoteDTO> {
        val authUserId = when (val details = authentication.details) {
            is Long -> details
            is Number -> details.toLong()
            is String -> details.toLongOrNull()
            else -> null
        } ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val quote = pricingService.calculateQuote(request, authUserId)
        return ResponseEntity.ok(quote)
    }
}
