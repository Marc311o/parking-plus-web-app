package com.parkingplus.tariffs

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull

data class TariffDTO(
    val id: Long? = null,

    @field:NotNull(message = "Daily flag cannot be null")
    var isDaily: Boolean,

    var dayOfWeek: String?, // Np. "MONDAY"

    @field:Min(0) @field:Max(23)
    var startHour: Int,

    @field:Min(0) @field:Max(23)
    var endHour: Int,

    var isFirstHour: Boolean,

    @field:NotNull(message = "Price cannot be null")
    @field:Min(0)
    var price: Double
)