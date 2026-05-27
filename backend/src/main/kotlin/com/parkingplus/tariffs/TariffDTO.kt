package com.parkingplus.tariffs

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.PositiveOrZero
import org.hibernate.validator.constraints.Range

data class TariffDTO(
    val id: Long? = null,

    @field:NotNull(message = "Daily flag cannot be null")
    var isDaily: Boolean = true,

    @field:Range(min = 1, max = 7, message = "Day of week must be between 1 and 7")  // 1-7
    var dayOfWeek: Int = 1,

    @field:Min(0) @field:Max(23)
    var startHour: Int = 0,

    @field:Min(0) @field:Max(24)
    var endHour: Int = 24,

    var isFirstHour: Boolean = true,

    @field:NotNull(message = "Price cannot be null")
    @field:PositiveOrZero(message = "Price must be a positive number")
    @field:Min(0)
    var price: Double = 0.0
)