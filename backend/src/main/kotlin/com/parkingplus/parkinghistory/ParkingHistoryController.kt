package com.parkingplus.parkinghistory

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/parking-history")
class ParkingHistoryController(
    private val parkingHistoryService: ParkingHistoryService
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
    fun getParkingHistoryByVehicle(@PathVariable vehicleId: Long): ResponseEntity<List<ParkingHistoryDTO>> {
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
}