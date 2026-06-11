package com.parkingplus.parkingspaces

import com.parkingplus.parkingspaces.enums.ParkingSpaceStatus
import com.parkingplus.parkingspaces.enums.SpaceType
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import org.springframework.http.ResponseEntity

@RestController
@RequestMapping("/api/parking-spaces")
@Tag(name = "Parking Spaces", description = "Zarządzanie fizycznymi miejscami parkingowymi i ich stanem")
class ParkingSpaceController(
    private val parkingSpaceService: ParkingSpaceService
) {

    @Operation(summary = "Pobierz wszystkie miejsca")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping
    fun getAllParkingSpaces(): List<ParkingSpaceDTO> =
        parkingSpaceService.getAllParkingSpaces()

    @Operation(summary = "Pobierz miejsce po ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/{id}")
    fun getParkingSpaceById(@PathVariable id: String): ParkingSpaceDTO =
        parkingSpaceService.getParkingSpaceById(id)

    @Operation(summary = "Pobierz miejsca na piętrze")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/level/{level}")
    fun getByLevel(@PathVariable level: Int): List<ParkingSpaceDTO> =
        parkingSpaceService.getByLevel(level)

    @Operation(summary = "Pobierz miejsca według typu")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/type/{spaceType}")
    fun getBySpaceType(@PathVariable spaceType: SpaceType): List<ParkingSpaceDTO> =
        parkingSpaceService.getBySpaceType(spaceType)

    @Operation(summary = "Pobierz miejsca według statusu")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/status/{status}")
    fun getByStatus(@PathVariable status: ParkingSpaceStatus): List<ParkingSpaceDTO> =
        parkingSpaceService.getByStatus(status)

    @Operation(summary = "Pobierz miejsca według piętra i typu")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/level/{level}/type/{spaceType}")
    fun getByLevelAndSpaceType(
        @PathVariable level: Int,
        @PathVariable spaceType: SpaceType
    ): List<ParkingSpaceDTO> =
        parkingSpaceService.getByLevelAndSpaceType(level, spaceType)

    @Operation(summary = "Utwórz nowe miejsce (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createParkingSpace(@Valid @RequestBody dto: ParkingSpaceDTO): ParkingSpaceDTO =
        parkingSpaceService.createParkingSpace(dto)

    @Operation(summary = "Aktualizuj miejsce (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping
    fun updateParkingSpace(
        @Valid @RequestBody dto: ParkingSpaceDTO
    ): ParkingSpaceDTO =
        parkingSpaceService.updateParkingSpace(dto.id, dto)

    @Operation(summary = "Usuń miejsce (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteParkingSpace(@PathVariable id: String) =
        parkingSpaceService.deleteParkingSpace(id)

    @Operation(summary = "Pobierz ogólne statystyki zajętości")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/occupancy")
    fun getParkingStats(): ParkingSpaceStatsDTO =
        parkingSpaceService.getDetailedStats()

    @Operation(summary = "Pobierz szczegółowe dane o miejscu (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}/details")
    fun getParkingSpaceDetails(@PathVariable id: String): ParkingSpotDetailsDTO =
        parkingSpaceService.getSpaceDetails(id)

    @Operation(summary = "Pobierz oś czasu obłożenia miejsca (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}/timeline")
    fun getSpaceTimeline(
        @PathVariable id: String,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate
    ): ResponseEntity<ParkingSpaceTimelineResponseDTO> {
        return ResponseEntity.ok(parkingSpaceService.getSpaceTimeline(id, date))
    }
}