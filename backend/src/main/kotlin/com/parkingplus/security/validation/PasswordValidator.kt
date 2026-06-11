package com.parkingplus.security.validation

import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import java.security.MessageDigest
import java.util.*

@Component
class PasswordValidator {

    private val restTemplate = RestTemplate()
    private val forbiddenWords = listOf(
        "parking", "parkingplus", "politechnika",
        "student", "uczelnia", "projekt", "admin", "polska", "system"
    )

    fun validate(password: String, userData: List<String>) {
        // 1. Minimum length
        if (password.length < 12) {
            throw IllegalArgumentException("Hasło musi mieć co najmniej 12 znaków")
        }

        // 2. Context-aware checks
        val normalizedPassword = password.lowercase(Locale.getDefault())

        // User data (name, surname, email)
        userData.forEach { data ->
            if (data.isNotBlank() && normalizedPassword.contains(data.lowercase(Locale.getDefault()))) {
                throw IllegalArgumentException("Hasło nie może zawierać Twoich danych osobowych")
            }
        }

        // App context words
        forbiddenWords.forEach { word ->
            if (normalizedPassword.contains(word)) {
                throw IllegalArgumentException("Hasło zawiera niedozwolone słowa związane z aplikacją")
            }
        }

        // 3. Common patterns (simplified)
        val commonPatterns = listOf(
            "123456", "qwerty", "password", "abcdef", "123456789", "zaq12wsx", 
            "marcin", "adam123", "haslo123", "admin123", "polska123", "qwertyuiop"
        )
        commonPatterns.forEach { pattern ->
            if (normalizedPassword.contains(pattern)) {
                throw IllegalArgumentException("Hasło zawiera zbyt proste i popularne sekwencje znaków")
            }
        }

        // 4. HIBP Leak Check
        if (isPasswordPwned(password)) {
            throw IllegalArgumentException("To hasło pojawiło się w znanych wyciekach danych. Wybierz inne.")
        }
    }

    private fun isPasswordPwned(password: String): Boolean {
        val sha1 = sha1(password)
        val prefix = sha1.substring(0, 5)
        val suffix = sha1.substring(5).uppercase(Locale.getDefault())

        val url = "https://api.pwnedpasswords.com/range/$prefix"
        val response = restTemplate.getForObject(url, String::class.java) ?: return false

        return response.lineSequence().any { line ->
            line.split(":")[0] == suffix
        }
    }

    private fun sha1(input: String): String {
        val md = MessageDigest.getInstance("SHA-1")
        val bytes = md.digest(input.toByteArray())
        return bytes.joinToString("") { "%02x".format(it) }.uppercase(Locale.getDefault())
    }
}
