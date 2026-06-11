package com.parkingplus.auth

import com.fasterxml.jackson.annotation.JsonInclude

data class LoginRequest(
    val email: String = "",
    val password: String = ""
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class LoginResponse(
    val token: String? = null,
    val mfaRequired: Boolean? = null,
    val preAuthToken: String? = null
)

data class MfaVerificationRequest(
    val preAuthToken: String = "",
    val code: String = ""
)

data class MfaSetupResponse(
    val secret: String,
    val qrCodeUri: String
)

data class ForgotPasswordRequest(
    val email: String = ""
)

data class ResetPasswordRequest(
    val token: String = "",
    val newPassword: String = ""
)

data class MfaConfirmRequest(
    val code: String = ""
)
