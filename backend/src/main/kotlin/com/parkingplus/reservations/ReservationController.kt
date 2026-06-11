package com.parkingplus.reservations

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/reservations")
@Tag(name = "Reservations", description = "Endpointy do wyceny i zakupu rezerwacji/sesji parkowania")
class ReservationController(
    private val pricingService: PricingService,
    private val reservationService: ReservationService
) {

    @Operation(summary = "Pobierz wycenę", description = "Oblicza cenę za postój na podstawie czasu i typu pojazdu.")
    @PreAuthorize("hasAnyRole('ADMIN','CLIENT')")
    @PostMapping("/quote")
    fun getQuote(
        @RequestBody request: ParkingPurchaseRequestDTO,
        authentication: Authentication
    ): ResponseEntity<ParkingQuoteDTO> {
        val authUserId = extractUserId(authentication)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val isAdmin = authentication.authorities.any { it.authority == "ROLE_ADMIN" }
        val quote = pricingService.calculateQuote(request, authUserId, isAdmin)
        return ResponseEntity.ok(quote)
    }

    @Operation(summary = "Zakup bilet/rezerwację", description = "Finalizuje proces zakupu miejsca parkingowego.")
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/purchase")
    fun purchase(
        @RequestBody request: ParkingPurchaseRequestDTO,
        authentication: Authentication
    ): ResponseEntity<ParkingPurchaseDTO> {
        val authUserId = extractUserId(authentication)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val isAdmin = authentication.authorities.any { it.authority == "ROLE_ADMIN" }

        return try {
            val result = reservationService.purchaseOrReserve(request, authUserId, isAdmin)
            ResponseEntity.ok(result)
        } catch (e: ResponseStatusException) {
            throw e
        } catch (e: IllegalStateException) {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).build()
        } catch (e: Exception) {
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    @Operation(summary = "Moje rezerwacje", description = "Zwraca listę wszystkich rezerwacji zalogowanego użytkownika.")
    @PreAuthorize("hasAnyRole('ADMIN','CLIENT')")
    @GetMapping("/my")
    fun getMyReservations(authentication: Authentication): ResponseEntity<List<ReservationDetailsDTO>> {
        val authUserId = extractUserId(authentication)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        val reservations = reservationService.getUserReservations(authUserId)
        return ResponseEntity.ok(reservations)
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
