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

    // TODO: Move to properties and make it configurable
    // For now, tokens will expire after 1 hour (3600000 ms)
    private val jwtExpirationMs = 3_600_000L

    private val secretKey = Keys.hmacShaKeyFor(secretKeyString.toByteArray())

    fun generateToken(user: UserEntity): String {
        return Jwts.builder().setSubject(user.email).claim("id", user.id).claim("isOperator", user.isOperator)
            .setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + jwtExpirationMs))
            .signWith(secretKey, SignatureAlgorithm.HS256).compact()
    }

    fun extractUsername(token: String): String {
        return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).body.subject
    }

    fun isOperator(token: String): Boolean {
        return Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token).body.get(
            "isOperator",
            Boolean::class.javaObjectType
        ) ?: false
    }

    fun isTokenValid(token: String): Boolean {
        return try {
            Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token)
            true
        } catch (e: Exception) {
            false
        }
    }
}