package com.parkingplus.vehicles

import com.parkingplus.vehicles.enums.CarType
import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

@Schema(description = "Dane pojazdu")
data class VehicleDTO(
    @Schema(description = "Unikalny identyfikator pojazdu", example = "1")
    val id: Long? = null,

    @field:NotBlank(message = "License plate number is required")
    @Schema(description = "Numer rejestracyjny pojazdu", example = "DW 12345")
    val licensePlate: String = "",

    @field:NotNull(message = "Owner ID is required")
    @Schema(description = "ID właściciela pojazdu", example = "10")
    val ownerId: Long = 0L,

    @field:NotNull(message = "Car type is required")
    @Schema(description = "Typ pojazdu (spalinowy/elektryczny, uprawnienia)")
    val carType: CarType = CarType.REGULAR_ABLEBODIED,

    @Schema(description = "Czy pojazd jest aktywny (soft-delete)", example = "true")
    val isActive: Boolean = true
)

