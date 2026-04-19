package com.parkingplus.vehicles

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/vehicles")
class VehicleController(private val vehicleService: VehicleService) {

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @PostMapping
    fun addVehicle(@Valid @RequestBody dto: VehicleDTO): ResponseEntity<VehicleDTO> {
        return ResponseEntity(vehicleService.createVehicle(dto), HttpStatus.CREATED)
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/owner/{ownerId}")
    fun getByOwner(@PathVariable ownerId: Long): ResponseEntity<List<VehicleDTO>> {
        return ResponseEntity.ok(vehicleService.getAllVehiclesByOwner(ownerId))
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/{plate}")
    fun getByPlate(@PathVariable plate: String): ResponseEntity<VehicleDTO> {
        val vehicle = vehicleService.getVehicleByPlate(plate)
        return vehicle?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @DeleteMapping("/{id}")
    fun removeVehicle(@PathVariable id: Long): ResponseEntity<Void> {
        vehicleService.deleteVehicle(id)
        return ResponseEntity.noContent().build()
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    fun getAllVehicles(): ResponseEntity<List<VehicleDTO>> {
        return ResponseEntity.ok(vehicleService.getAllVehicles())
    }
}