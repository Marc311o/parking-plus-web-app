package com.parkingplus.vehicles

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/vehicles")
class VehicleController(private val vehicleService: VehicleService) {

    @PostMapping
    fun addVehicle(@Valid @RequestBody dto: VehicleDTO): ResponseEntity<VehicleDTO> {
        return ResponseEntity(vehicleService.createVehicle(dto), HttpStatus.CREATED)
    }

    @GetMapping("/owner/{ownerId}")
    fun getByOwner(@PathVariable ownerId: Long): ResponseEntity<List<VehicleDTO>> {
        return ResponseEntity.ok(vehicleService.getAllVehiclesByOwner(ownerId))
    }

    @GetMapping("/{plate}")
    fun getByPlate(@PathVariable plate: String): ResponseEntity<VehicleDTO> {
        val vehicle = vehicleService.getVehicleByPlate(plate)
        return vehicle?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
    }

    @DeleteMapping("/{id}")
    fun removeVehicle(@PathVariable id: Long): ResponseEntity<Void> {
        vehicleService.deleteVehicle(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping
    fun getAllVehicles(): ResponseEntity<List<VehicleDTO>> {
        return ResponseEntity.ok(vehicleService.getAllVehicles())
    }
}