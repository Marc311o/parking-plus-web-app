package com.parkingplus.security

import dev.samstevens.totp.code.DefaultCodeGenerator
import dev.samstevens.totp.code.DefaultCodeVerifier
import dev.samstevens.totp.code.HashingAlgorithm
import dev.samstevens.totp.secret.DefaultSecretGenerator
import dev.samstevens.totp.time.SystemTimeProvider
import org.springframework.stereotype.Service

@Service
class TwoFactorAuthService {

    private val secretGenerator = DefaultSecretGenerator()
    private val timeProvider = SystemTimeProvider()
    private val codeGenerator = DefaultCodeGenerator(HashingAlgorithm.SHA1, 6)
    private val verifier = DefaultCodeVerifier(codeGenerator, timeProvider)

    fun generateNewSecret(): String = secretGenerator.generate()

    fun isCodeValid(secret: String, code: String): Boolean {
        return verifier.isValidCode(secret, code)
    }

    fun getQrCodeUri(secret: String, email: String): String {
        return "otpauth://totp/ParkingPlus:$email?secret=$secret&issuer=ParkingPlus"
    }
}