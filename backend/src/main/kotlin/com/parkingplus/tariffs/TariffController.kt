package com.parkingplus.tariffs

import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.web.bind.annotation.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize

@RestController
@RequestMapping("/api/tariffs")
@Tag(name = "Tariffs", description = "Zarządzanie cennikami i taryfami parkingowymi")
class TariffController(private val tariffService: TariffService) {

    @Operation(summary = "Pobierz wszystkie taryfy")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping
    fun getAll(): List<TariffDTO> = tariffService.getAllTariffs()

    @Operation(summary = "Utwórz nową taryfę (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    fun create(@Valid @RequestBody dto: TariffDTO): ResponseEntity<TariffDTO> {
        return ResponseEntity(tariffService.createTariff(dto), HttpStatus.CREATED)
    }

    @Operation(summary = "Usuń taryfę (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        tariffService.deleteTariff(id)
        return ResponseEntity.noContent().build()
    }

    @Operation(summary = "Aktualizuj taryfę (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @Valid @RequestBody dto: TariffDTO): ResponseEntity<TariffDTO> {
        return ResponseEntity.ok(tariffService.updateTariff(id, dto))
    }

}