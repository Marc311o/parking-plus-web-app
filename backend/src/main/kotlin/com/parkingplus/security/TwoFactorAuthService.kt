package com.parkingplus.security

import dev.samstevens.totp.code.DefaultCodeGenerator
import dev.samstevens.totp.code.DefaultCodeVerifier
import dev.samstevens.totp.code.HashingAlgorithm
import dev.samstevens.totp.secret.DefaultSecretGenerator
import dev.samstevens.totp.time.SystemTimeProvider
import org.springframework.stereotype.Service
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

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
        val encodedEmail = URLEncoder.encode(email, StandardCharsets.UTF_8)
        return "otpauth://totp/ParkingPlus:$encodedEmail?secret=$secret&issuer=ParkingPlus"
    }
}
