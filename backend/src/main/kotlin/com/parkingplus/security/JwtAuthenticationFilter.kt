package com.parkingplus.security

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }

        val jwt = authHeader.substring(7)

        if (jwtService.isTokenValid(jwt) && SecurityContextHolder.getContext().authentication == null) {
            val userEmail = jwtService.extractUsername(jwt)
            val isOperator = jwtService.isOperator(jwt)

            val role = if (isOperator) "ROLE_ADMIN" else "ROLE_CLIENT"
            val authorities = listOf(SimpleGrantedAuthority(role))

            val authToken = UsernamePasswordAuthenticationToken(userEmail, null, authorities)
            SecurityContextHolder.getContext().authentication = authToken
        }

        filterChain.doFilter(request, response)
    }
}