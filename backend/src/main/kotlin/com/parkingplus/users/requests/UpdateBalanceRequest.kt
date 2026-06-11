package com.parkingplus.users.requests

import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotNull
import java.math.BigDecimal

data class UpdateBalanceRequest(

    @field:NotNull(message = "Kwota jest wymagana")
    @field:DecimalMin(value = "0.01", message = "Kwota musi być >= 0.01")
    val amount: BigDecimal
)