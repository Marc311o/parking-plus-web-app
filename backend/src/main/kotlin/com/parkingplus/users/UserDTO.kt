package com.parkingplus.users

import io.swagger.v3.oas.annotations.media.Schema
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import java.math.BigDecimal

@Schema(description = "Dane szczegółowe użytkownika")
data class UserDTO(
    @Schema(description = "ID użytkownika", example = "1")
    val id: Long? = null,

    @field:NotBlank(message = "Imię nie może być puste")
    @Schema(description = "Imię", example = "Jan")
    val name: String = "",

    @field:NotBlank(message = "Nazwisko nie może być puste")
    @Schema(description = "Nazwisko", example = "Kowalski")
    val surname: String = "",

    @field:Email(message = "To nie jest poprawny adres e-mail")
    @field:NotBlank(message = "Email jest wymagany")
    @Schema(description = "Adres email", example = "jan.kowalski@example.com")
    val email: String = "",

    @Schema(description = "Czy użytkownik jest operatorem/adminem", example = "false")
    val isOperator: Boolean = false,

    @Schema(description = "Czy uwierzytelnianie dwuetapowe jest włączone", example = "true")
    val isMfaEnabled: Boolean = false,

    @Schema(description = "Aktualne saldo portfela", example = "150.50")
    val balance: BigDecimal = BigDecimal.ZERO
)
