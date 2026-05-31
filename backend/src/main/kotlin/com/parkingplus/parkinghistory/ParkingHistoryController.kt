package com.parkingplus.parkinghistory

import com.parkingplus.vehicles.VehicleService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import java.time.LocalDate

@RestController
@RequestMapping("/api/parking-history")
@Tag(name = "Parking History & Statistics", description = "Endpointy do historii parkowania, zdarzeń i statystyk (głównie dla Admina)")
class ParkingHistoryController(
    private val parkingHistoryService: ParkingHistoryService,
    private val vehicleService: VehicleService
) {

    @Operation(summary = "Dodaj wpis do historii", description = "Ręczne dodanie wpisu o parkowaniu.")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @PostMapping
    fun addParkingHistory(@Valid @RequestBody dto: ParkingHistoryDTO): ResponseEntity<ParkingHistoryDTO> {
        return ResponseEntity(parkingHistoryService.createParkingHistory(dto), HttpStatus.CREATED)
    }

    @Operation(summary = "Pobierz całą historię (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    fun getAllParkingHistory(): ResponseEntity<List<ParkingHistoryDTO>> {
        return ResponseEntity.ok(parkingHistoryService.getAllParkingHistory())
    }

    @Operation(summary = "Pobierz aktywne sesje parkowania (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/active")
    fun getActiveParkingHistory(): ResponseEntity<List<ParkingHistoryDTO>> {
        return ResponseEntity.ok(parkingHistoryService.getActiveParkingHistory())
    }

    @Operation(summary = "Pobierz historię pojazdu", description = "Zwraca historię parkowania dla konkretnego pojazdu.")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/vehicle/{vehicleId}")
    fun getParkingHistoryByVehicle(
        @PathVariable vehicleId: Long,
        authentication: Authentication
    ): ResponseEntity<List<ParkingHistoryDTO>> {
        val authUserId = authentication.details as? Long
        if (authentication.authorities.none { it.authority == "ROLE_ADMIN" } ) {
            val vehicle = vehicleService.getVehicleById(vehicleId)
                ?: return ResponseEntity.notFound().build()
            if (vehicle.ownerId != authUserId) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
            }
        }
        return ResponseEntity.ok(parkingHistoryService.getParkingHistoryByVehicle(vehicleId))
    }

    @Operation(summary = "Zakończ parkowanie (Admin)", description = "Rejestruje wyjazd pojazdu o danym numerze rejestracyjnym.")
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/end/{licensePlate}")
    fun endParking(
        @PathVariable licensePlate: String,
    ): ResponseEntity<ParkingHistoryDTO> {
        return ResponseEntity.ok(parkingHistoryService.endParking(licensePlate))
    }

    @Operation(summary = "Pobierz opłatę za trwający postój", description = "Zwraca aktualną kwotę do zapłaty za postój bezterminowy.")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/checkout/{id}/fee")
    fun getCheckoutFee(
        @PathVariable id: Long,
        authentication: Authentication
    ): ResponseEntity<CheckoutDetailsDTO> {
        val authUserId = authentication.details as? Long ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        val isAdmin = authentication.authorities.any { it.authority == "ROLE_ADMIN" }
        return ResponseEntity.ok(parkingHistoryService.calculateCurrentIndefiniteFee(id, authUserId, isAdmin))
    }

    @Operation(summary = "Opłać i zakończ postój bezterminowy", description = "Pobiera opłatę z salda i zwalnia miejsce.")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @PostMapping("/checkout/{id}")
    fun checkoutParking(
        @PathVariable id: Long,
        authentication: Authentication
    ): ResponseEntity<ParkingHistoryDTO> {
        val authUserId = authentication.details as? Long ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        return ResponseEntity.ok(parkingHistoryService.checkoutIndefinite(id, authUserId))
    }

    @Operation(summary = "Usuń wpis historii (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    fun deleteParkingHistory(@PathVariable id: Long): ResponseEntity<Void> {
        parkingHistoryService.deleteParkingHistory(id)
        return ResponseEntity.noContent().build()
    }

    @Operation(summary = "Wyczyść całą historię (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping()
    fun deleteAllParkingHistory(): ResponseEntity<Void> {
        parkingHistoryService.deleteAllParkingHistory()
        return ResponseEntity.noContent().build()
    }

    @Operation(summary = "Pobierz historię miejsca parkingowego (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/parking-space/{parkingSpaceId}")
    fun getParkingHistoryByParkingSpace(@PathVariable parkingSpaceId: String): ResponseEntity<List<ParkingHistoryDTO>> {
        return ResponseEntity.ok(parkingHistoryService.getParkingHistoryByParkingSpace(parkingSpaceId))
    }

    @Operation(summary = "Pobierz dzienny przychód (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/daily-revenue")
    fun getDailyRevenue(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate
    ): ResponseEntity<Double> {
        val revenue = parkingHistoryService.getDailyRevenue(date)
        return ResponseEntity.ok(revenue)
    }

    @Operation(summary = "Statystyki wjazdów (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/entries-stats")
    fun getEntriesStats(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate,
        @RequestParam period: AggregationPeriod
    ): ResponseEntity<EntriesResponseDTO> {
        return ResponseEntity.ok(parkingHistoryService.getEntriesStatistics(date, period))
    }

    @Operation(summary = "Statystyki przychodów (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/revenue-stats")
    fun getRevenueStats(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate,
        @RequestParam period: AggregationPeriod
    ): ResponseEntity<RevenueStatsResponseDTO> {
        return ResponseEntity.ok(parkingHistoryService.getRevenueStatistics(date, period))
    }

    @Operation(summary = "Średni czas postoju (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/average-stay")
    fun getAverageStayStats(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate,
        @RequestParam period: AggregationPeriod
    ): ResponseEntity<AverageStayResponseDTO> {
        return ResponseEntity.ok(parkingHistoryService.getAverageStayStatistics(date, period))
    }

    @Operation(summary = "Ranking obłożenia miejsc (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/ranking")
    fun getSpaceRanking(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate,
        @RequestParam period: AggregationPeriod,
        @RequestParam floor: ParkingFloor
    ): ResponseEntity<ParkingSpaceRankingResponseDTO> {
        return ResponseEntity.ok(parkingHistoryService.getSpaceRanking(date, period, floor))
    }

    @Operation(summary = "Pobierz listę zdarzeń parkingowych (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/events")
    fun getParkingEvents(): ResponseEntity<List<ParkingEventDTO>> {
        return ResponseEntity.ok(parkingHistoryService.getParkingEvents())
    }
}