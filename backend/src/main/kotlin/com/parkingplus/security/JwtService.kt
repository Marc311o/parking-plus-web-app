package com.parkingplus.security

import com.parkingplus.users.UserEntity
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Service
import java.util.Date

@Service
class JwtService {

    private val secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256)

    // For now token will be valid for 1h
    private val tokenLifeTimeMs = 3_600_000L

    fun generateToken(user: UserEntity): String {
        return Jwts.builder()
            .setSubject(user.email)
            .claim("id", user.id)
            .claim("isOperator", user.isOperator)
            .setIssuedAt(Date(System.currentTimeMillis()))
            .setExpiration(Date(System.currentTimeMillis() + tokenLifeTimeMs))
            .signWith(secretKey)
            .compact()
    }
}