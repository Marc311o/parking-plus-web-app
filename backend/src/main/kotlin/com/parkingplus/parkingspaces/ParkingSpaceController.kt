package com.parkingplus.parkingspaces

import com.parkingplus.parkingspaces.enums.ParkingSpaceStatus
import com.parkingplus.parkingspaces.enums.SpaceType
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/parking-spaces")
class ParkingSpaceController(
    private val parkingSpaceService: ParkingSpaceService
) {

    @GetMapping
    fun getAllParkingSpaces(): List<ParkingSpaceDTO> =
        parkingSpaceService.getAllParkingSpaces()

    @GetMapping("/{id}")
    fun getParkingSpaceById(@PathVariable id: String): ParkingSpaceDTO =
        parkingSpaceService.getParkingSpaceById(id)

    @GetMapping("/level/{level}")
    fun getByLevel(@PathVariable level: Int): List<ParkingSpaceDTO> =
        parkingSpaceService.getByLevel(level)

    @GetMapping("/type/{spaceType}")
    fun getBySpaceType(@PathVariable spaceType: SpaceType): List<ParkingSpaceDTO> =
        parkingSpaceService.getBySpaceType(spaceType)

    @GetMapping("/status/{status}")
    fun getByStatus(@PathVariable status: ParkingSpaceStatus): List<ParkingSpaceDTO> =
        parkingSpaceService.getByStatus(status)

    @GetMapping("/level/{level}/type/{spaceType}")
    fun getByLevelAndSpaceType(
        @PathVariable level: Int,
        @PathVariable spaceType: SpaceType
    ): List<ParkingSpaceDTO> =
        parkingSpaceService.getByLevelAndSpaceType(level, spaceType)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createParkingSpace(@RequestBody dto: ParkingSpaceDTO): ParkingSpaceDTO =
        parkingSpaceService.createParkingSpace(dto)

    @PutMapping("/{id}")
    fun updateParkingSpace(
        @PathVariable id: String,
        @RequestBody dto: ParkingSpaceDTO
    ): ParkingSpaceDTO =
        parkingSpaceService.updateParkingSpace(id, dto)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteParkingSpace(@PathVariable id: String) =
        parkingSpaceService.deleteParkingSpace(id)
}