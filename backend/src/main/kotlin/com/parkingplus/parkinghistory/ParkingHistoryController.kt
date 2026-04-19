package com.parkingplus.parkinghistory

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/parking-history")
class ParkingHistoryController(
    private val parkingHistoryService: ParkingHistoryService
) {

    @PostMapping
    fun addParkingHistory(@Valid @RequestBody dto: ParkingHistoryDTO): ResponseEntity<ParkingHistoryDTO> {
        return ResponseEntity(parkingHistoryService.createParkingHistory(dto), HttpStatus.CREATED)
    }

    @GetMapping
    fun getAllParkingHistory(): ResponseEntity<List<ParkingHistoryDTO>> {
        return ResponseEntity.ok(parkingHistoryService.getAllParkingHistory())
    }

    @GetMapping("/active")
    fun getActiveParkingHistory(): ResponseEntity<List<ParkingHistoryDTO>> {
        return ResponseEntity.ok(parkingHistoryService.getActiveParkingHistory())
    }

    @GetMapping("/vehicle/{vehicleId}")
    fun getParkingHistoryByVehicle(@PathVariable vehicleId: Long): ResponseEntity<List<ParkingHistoryDTO>> {
        return ResponseEntity.ok(parkingHistoryService.getParkingHistoryByVehicle(vehicleId))
    }

    @PatchMapping("/end/{licensePlate}")
    fun endParking(
        @PathVariable licensePlate: String,
    ): ResponseEntity<ParkingHistoryDTO> {
        return ResponseEntity.ok(parkingHistoryService.endParking(licensePlate))
    }

    @DeleteMapping("/{id}")
    fun deleteParkingHistory(@PathVariable id: Long): ResponseEntity<Void> {
        parkingHistoryService.deleteParkingHistory(id)
        return ResponseEntity.noContent().build()
    }

    @DeleteMapping()
    fun deleteAllParkingHistory(): ResponseEntity<Void> {
        parkingHistoryService.deleteAllParkingHistory()
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/parking-space/{parkingSpaceId}")
    fun getParkingHistoryByParkingSpace(@PathVariable parkingSpaceId: String): ResponseEntity<List<ParkingHistoryDTO>> {
        return ResponseEntity.ok(parkingHistoryService.getParkingHistoryByParkingSpace(parkingSpaceId))
    }
}