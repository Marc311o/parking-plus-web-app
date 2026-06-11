package com.parkingplus.vehicles

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.responses.ApiResponses
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/vehicles")
@Tag(name = "Vehicles", description = "Zarządzanie pojazdami użytkowników")
@ApiResponses(value = [
    ApiResponse(responseCode = "401", description = "Brak autoryzacji (nieprawidłowy token)"),
    ApiResponse(responseCode = "403", description = "Brak uprawnień do wykonania tej operacji")
])
class VehicleController(private val vehicleService: VehicleService) {

    @Operation(summary = "Dodaj nowy pojazd", description = "Tworzy nowy pojazd lub reaktywuje usunięty.")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @PostMapping
    fun addVehicle(@Valid @RequestBody dto: VehicleDTO, authentication: Authentication): ResponseEntity<VehicleDTO> {
        val authUserId = authentication.details as? Long
        val effectiveOwnerId = if (authentication.authorities.any { it.authority == "ROLE_ADMIN" }) {
            dto.ownerId
        } else {
            authUserId ?: return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }
        return ResponseEntity(vehicleService.createVehicle(dto.copy(ownerId = effectiveOwnerId)), HttpStatus.CREATED)
    }

    @Operation(summary = "Pobierz pojazdy właściciela", description = "Zwraca listę wszystkich aktywnych pojazdów danego użytkownika.")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/owner/{ownerId}")
    fun getByOwner(@PathVariable ownerId: Long, authentication: Authentication): ResponseEntity<List<VehicleDTO>> {
        val authUserId = authentication.details as? Long
        if (authentication.authorities.none { it.authority == "ROLE_ADMIN" } && authUserId != ownerId) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }
        return ResponseEntity.ok(vehicleService.getAllVehiclesByOwner(ownerId))
    }

    @Operation(summary = "Pobierz pojazd po numerze rejestracyjnym")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/{plate}")
    fun getByPlate(@PathVariable plate: String): ResponseEntity<VehicleDTO> {
        val vehicle = vehicleService.getVehicleByPlate(plate)
        return vehicle?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
    }

    @Operation(summary = "Usuń pojazd (soft-delete)")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @DeleteMapping("/{id}")
    fun removeVehicle(@PathVariable id: Long, authentication: Authentication): ResponseEntity<Void> {
        val authUserId = authentication.details as? Long
        if (authentication.authorities.none { it.authority == "ROLE_ADMIN" }) {
            val vehicle = vehicleService.getVehicleById(id)
                ?: return ResponseEntity.notFound().build()
            if (vehicle.ownerId != authUserId) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
            }
        }
        vehicleService.deleteVehicle(id)
        return ResponseEntity.noContent().build()
    }

    @Operation(summary = "Pobierz wszystkie pojazdy (tylko Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    fun getAllVehicles(): ResponseEntity<List<VehicleDTO>> {
        return ResponseEntity.ok(vehicleService.getAllVehicles())
    }

    @Operation(summary = "Aktualizuj dane pojazdu")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @PutMapping("/{id}")
    fun updateVehicle(
        @PathVariable id: Long,
        @Valid @RequestBody dto: UpdateVehicleDTO,
        authentication: Authentication
    ): ResponseEntity<VehicleDTO> {
        val authUserId = authentication.details as? Long
        if (authentication.authorities.none { it.authority == "ROLE_ADMIN" }) {
            val vehicle = vehicleService.getVehicleById(id)
                ?: return ResponseEntity.notFound().build()
            if (vehicle.ownerId != authUserId) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
            }
        }

        return ResponseEntity.ok(
            vehicleService.updateVehicle(id, dto)
        )
    }
}
