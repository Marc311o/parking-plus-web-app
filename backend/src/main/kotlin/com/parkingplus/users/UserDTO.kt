package com.parkingplus.users

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class UserDTO(
    val id: Long? = null,

    @field:NotBlank(message = "Imię nie może być puste")
    val name: String = "",

    @field:NotBlank(message = "Nazwisko nie może być puste")
    val surname: String = "",

    @field:Email(message = "To nie jest poprawny adres e-mail")
    @field:NotBlank(message = "Email jest wymagany")
    val email: String = "",

    val isOperator: Boolean = false,

    val isMfaEnabled: Boolean = false
)