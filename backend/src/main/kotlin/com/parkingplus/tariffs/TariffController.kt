package com.parkingplus.tariffs

import jakarta.validation.Valid
import org.springframework.web.bind.annotation.*
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

@RestController
@RequestMapping("/api/tariffs")
class TariffController(private val tariffService: TariffService) {

    @GetMapping
    fun getAll(): List<TariffDTO> = tariffService.getAllTariffs()

    @PostMapping
    fun create(@Valid @RequestBody dto: TariffDTO): ResponseEntity<TariffDTO> {
        return ResponseEntity(tariffService.createTariff(dto), HttpStatus.CREATED)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        tariffService.deleteTariff(id)
        return ResponseEntity.noContent().build()
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @Valid @RequestBody dto: TariffDTO): ResponseEntity<TariffDTO> {
        return ResponseEntity.ok(tariffService.updateTariff(id, dto))
    }

}