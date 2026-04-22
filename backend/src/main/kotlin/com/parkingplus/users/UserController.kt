package com.parkingplus.users

import com.parkingplus.auth.MfaSetupResponse
import com.parkingplus.users.requests.CreateUserRequest
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    fun getAll(): ResponseEntity<List<UserDTO>> =
        ResponseEntity.ok(userService.getAllUsers())


    @PostMapping
    fun create(@Valid @RequestBody request: CreateUserRequest): ResponseEntity<UserDTO> {
        return ResponseEntity(userService.createUser(request), HttpStatus.CREATED)
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long, authentication: Authentication): ResponseEntity<UserDTO> {
        val authUserId = authentication.details as? Long
        if (authentication.authorities.none { it.authority == "ROLE_ADMIN" } && authUserId != id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }
        return ResponseEntity.ok(userService.getUserById(id))
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        userService.deleteUser(id)
        return ResponseEntity.noContent().build()
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/operator")
    fun createOperator(@Valid @RequestBody request: CreateUserRequest): ResponseEntity<UserDTO> {
        return ResponseEntity(userService.createOperator(request), HttpStatus.CREATED)
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @PostMapping("/{id}/mfa-setup")
    fun setupMfa(@PathVariable id: Long, authentication: Authentication): ResponseEntity<MfaSetupResponse> {
        val authUserId = authentication.details as? Long
        if (authentication.authorities.none { it.authority == "ROLE_ADMIN" } && authUserId != id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }
        return ResponseEntity.ok(userService.generateMfaSetup(id))
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @PostMapping("/{id}/mfa-confirm")
    fun confirmMfa(@PathVariable id: Long, @RequestBody request: com.parkingplus.auth.MfaConfirmRequest, authentication: Authentication): ResponseEntity<String> {
        val authUserId = authentication.details as? Long
        if (authentication.authorities.none { it.authority == "ROLE_ADMIN" } && authUserId != id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }
        val success = userService.confirmMfaSetup(id, request.code)
        return if (success) {
            ResponseEntity.ok("2FA aktywowane pomyślnie")
        } else {
            ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Nieprawidłowy kod weryfikacyjny")
        }
    }
}
