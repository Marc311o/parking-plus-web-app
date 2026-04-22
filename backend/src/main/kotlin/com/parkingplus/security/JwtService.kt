package com.parkingplus.security

import com.parkingplus.users.UserEntity
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.util.Date

@Service
class JwtService(

    @Value("\${jwt.secret}") private val secretKeyString: String
) {

    // Tokens expire after 1 hour (3600000 ms)
    private val jwtExpirationMs = 3_600_000L

    // Pre-auth tokens expire after 5 minutes (for MFA verification step)
    private val preAuthExpirationMs = 5 * 60 * 1000L

    private val secretKey = Keys.hmacShaKeyFor(secretKeyString.toByteArray())

    fun generateToken(user: UserEntity): String {
        return Jwts.builder()
            .setSubject(user.email)
            .claim("id", user.id)
            .claim("isOperator", user.isOperator)
            .setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + jwtExpirationMs))
            .signWith(secretKey, SignatureAlgorithm.HS256)
            .compact()
    }

    fun generatePreAuthToken(user: UserEntity): String {
        return Jwts.builder()
            .setSubject(user.email)
            .claim("type", "PRE_AUTH")
            .setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + preAuthExpirationMs))
            .signWith(secretKey, SignatureAlgorithm.HS256)
            .compact()
    }

    fun validatePreAuthToken(token: String): String? {
        return try {
            val claims = Jwts.parserBuilder().setSigningKey(secretKey).build()
                .parseClaimsJws(token).body
            if (claims.get("type") == "PRE_AUTH") claims.subject else null
        } catch (e: Exception) {
            null
        }
    }

    fun extractUsername(token: String): String {
        return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).body.subject
    }

    fun extractUserId(token: String): Long? {
        return Jwts.parserBuilder().setSigningKey(secretKey).build()
            .parseClaimsJws(token).body.get("id", Long::class.javaObjectType)
    }

    fun isOperator(token: String): Boolean {
        return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).body.get(
            "isOperator",
            Boolean::class.javaObjectType
        ) ?: false
    }

    fun isTokenValid(token: String): Boolean {
        return try {
            val claims = Jwts.parserBuilder().setSigningKey(secretKey).build()
                .parseClaimsJws(token).body
            // Pre-auth tokens must not be accepted as full access tokens
            claims.get("type") != "PRE_AUTH"
        } catch (e: Exception) {
            false
        }
    }
}
