package com.parkingplus.config

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.context.request.WebRequest

@ControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(Exception::class)
    fun handleAllExceptions(ex: Exception, request: WebRequest): ResponseEntity<Map<String, Any>> {
        val body = mutableMapOf<String, Any>(
            "timestamp" to java.time.Instant.now().toString(),
            "status" to HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "error" to "Internal Server Error",
            "message" to (ex.message ?: "Unknown error"),
            "path" to request.getDescription(false)
        )
        
        // Print stack trace to console as well
        ex.printStackTrace()
        
        return ResponseEntity(body, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}
