package com.parkingplus.parkingspaces

import com.parkingplus.parkingspaces.enums.ParkingSpaceStatus
import com.parkingplus.parkingspaces.enums.SpaceType
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import org.springframework.http.ResponseEntity

@RestController
@RequestMapping("/api/parking-spaces")
class ParkingSpaceController(
    private val parkingSpaceService: ParkingSpaceService
) {

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping
    fun getAllParkingSpaces(): List<ParkingSpaceDTO> =
        parkingSpaceService.getAllParkingSpaces()

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/{id}")
    fun getParkingSpaceById(@PathVariable id: String): ParkingSpaceDTO =
        parkingSpaceService.getParkingSpaceById(id)

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/level/{level}")
    fun getByLevel(@PathVariable level: Int): List<ParkingSpaceDTO> =
        parkingSpaceService.getByLevel(level)

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/type/{spaceType}")
    fun getBySpaceType(@PathVariable spaceType: SpaceType): List<ParkingSpaceDTO> =
        parkingSpaceService.getBySpaceType(spaceType)

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/status/{status}")
    fun getByStatus(@PathVariable status: ParkingSpaceStatus): List<ParkingSpaceDTO> =
        parkingSpaceService.getByStatus(status)

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/level/{level}/type/{spaceType}")
    fun getByLevelAndSpaceType(
        @PathVariable level: Int,
        @PathVariable spaceType: SpaceType
    ): List<ParkingSpaceDTO> =
        parkingSpaceService.getByLevelAndSpaceType(level, spaceType)

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createParkingSpace(@Valid @RequestBody dto: ParkingSpaceDTO): ParkingSpaceDTO =
        parkingSpaceService.createParkingSpace(dto)

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping
    fun updateParkingSpace(
        @Valid @RequestBody dto: ParkingSpaceDTO
    ): ParkingSpaceDTO =
        parkingSpaceService.updateParkingSpace(dto.id, dto)

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteParkingSpace(@PathVariable id: String) =
        parkingSpaceService.deleteParkingSpace(id)

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/occupancy")
    fun getParkingStats(): ParkingSpaceStatsDTO =
        parkingSpaceService.getDetailedStats()

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}/details")
    fun getParkingSpaceDetails(@PathVariable id: String): ParkingSpotDetailsDTO =
        parkingSpaceService.getSpaceDetails(id)

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}/timeline")
    fun getSpaceTimeline(
        @PathVariable id: String,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) date: LocalDate
    ): ResponseEntity<ParkingSpaceTimelineResponseDTO> {
        return ResponseEntity.ok(parkingSpaceService.getSpaceTimeline(id, date))
    }
}