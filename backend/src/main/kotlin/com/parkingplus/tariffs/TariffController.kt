package com.parkingplus.tariffs

import jakarta.validation.Valid
import org.springframework.web.bind.annotation.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize

@RestController
@RequestMapping("/api/tariffs")
class TariffController(private val tariffService: TariffService) {

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping
    fun getAll(): List<TariffDTO> = tariffService.getAllTariffs()

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    fun create(@Valid @RequestBody dto: TariffDTO): ResponseEntity<TariffDTO> {
        return ResponseEntity(tariffService.createTariff(dto), HttpStatus.CREATED)
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        tariffService.deleteTariff(id)
        return ResponseEntity.noContent().build()
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @Valid @RequestBody dto: TariffDTO): ResponseEntity<TariffDTO> {
        return ResponseEntity.ok(tariffService.updateTariff(id, dto))
    }

}