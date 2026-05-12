package com.parkingplus.parkinghistory

import com.parkingplus.vehicles.VehicleService
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
class ParkingHistoryController(
    private val parkingHistoryService: ParkingHistoryService,
    private val vehicleService: VehicleService
) {

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @PostMapping
    fun addParkingHistory(@Valid @RequestBody dto: ParkingHistoryDTO): ResponseEntity<ParkingHistoryDTO> {
        return ResponseEntity(parkingHistoryService.createParkingHistory(dto), HttpStatus.CREATED)
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    fun getAllParkingHistory(): ResponseEntity<List<ParkingHistoryDTO>> {
        return ResponseEntity.ok(parkingHistoryService.getAllParkingHistory())
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/active")
    fun getActiveParkingHistory(): ResponseEntity<List<ParkingHistoryDTO>> {
        return ResponseEntity.ok(parkingHistoryService.getActiveParkingHistory())
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/vehicle/{vehicleId}")
    fun getParkingHistoryByVehicle(
        @PathVariable vehicleId: Long,
        authentication: Authentication
    ): ResponseEntity<List<ParkingHistoryDTO>> {
        val authUserId = authentication.details as? Long
        if (authentication.authorities.none { it.authority == "ROLE_ADMIN" }) {
            val vehicle = vehicleService.getVehicleById(vehicleId)
                ?: return ResponseEntity.notFound().build()
            if (vehicle.ownerId != authUserId) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
            }
        }
        return ResponseEntity.ok(parkingHistoryService.getParkingHistoryByVehicle(vehicleId))
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/end/{licensePlate}")
    fun endParking(
        @PathVariable licensePlate: String,
    ): ResponseEntity<ParkingHistoryDTO> {
        return ResponseEntity.ok(parkingHistoryService.endParking(licensePlate))
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    fun deleteParkingHistory(@PathVariable id: Long): ResponseEntity<Void> {
        parkingHistoryService.deleteParkingHistory(id)
        return ResponseEntity.noContent().build()
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping()
    fun deleteAllParkingHistory(): ResponseEntity<Void> {
        parkingHistoryService.deleteAllParkingHistory()
        return ResponseEntity.noContent().build()
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/parking-space/{parkingSpaceId}")
    fun getParkingHistoryByParkingSpace(@PathVariable parkingSpaceId: String): ResponseEntity<List<ParkingHistoryDTO>> {
        return ResponseEntity.ok(parkingHistoryService.getParkingHistoryByParkingSpace(parkingSpaceId))
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/daily-revenue")
    fun getDailyRevenue(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate
    ): ResponseEntity<Double> {
        val revenue = parkingHistoryService.getDailyRevenue(date)
        return ResponseEntity.ok(revenue)
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/entries-stats")
    fun getEntriesStats(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate,
        @RequestParam period: AggregationPeriod
    ): ResponseEntity<EntriesResponseDTO> {
        return ResponseEntity.ok(parkingHistoryService.getEntriesStatistics(date, period))
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/revenue-stats")
    fun getRevenueStats(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate,
        @RequestParam period: AggregationPeriod
    ): ResponseEntity<RevenueStatsResponseDTO> {
        return ResponseEntity.ok(parkingHistoryService.getRevenueStatistics(date, period))
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/average-stay")
    fun getAverageStayStats(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate,
        @RequestParam period: AggregationPeriod
    ): ResponseEntity<AverageStayResponseDTO> {
        return ResponseEntity.ok(parkingHistoryService.getAverageStayStatistics(date, period))
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/ranking")
    fun getSpaceRanking(
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate,
        @RequestParam floor: ParkingFloor
    ): ResponseEntity<ParkingSpaceRankingResponseDTO> {
        return ResponseEntity.ok(parkingHistoryService.getSpaceRanking(date, floor))
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/events")
    fun getParkingEvents(): ResponseEntity<List<ParkingEventDTO>> {
        return ResponseEntity.ok(parkingHistoryService.getParkingEvents())
    }
}