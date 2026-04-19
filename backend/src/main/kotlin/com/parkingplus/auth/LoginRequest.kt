package com.parkingplus.auth

import com.fasterxml.jackson.annotation.JsonInclude

data class LoginRequest(
    val email: String = "",
    val password: String = ""
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class LoginResponse(
    val token: String? = null,
    val mfaRequired: Boolean? = false,
    val email: String? = null
)

data class MfaVerificationRequest(
    val email: String = "",
    val code: String = ""
)

data class MfaSetupResponse(
    val secret: String,
    val qrCodeUri: String
)