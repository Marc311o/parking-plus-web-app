package com.parkingplus.users

import com.parkingplus.auth.MfaSetupResponse
import com.parkingplus.users.requests.CreateUserRequest
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.*
import com.parkingplus.users.requests.UpdateBalanceRequest
import java.math.BigDecimal

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "Zarządzanie użytkownikami, operatorami i portfelem (saldo)")
class UserController(private val userService: UserService) {

    @Operation(summary = "Pobierz wszystkich użytkowników (Admin)", description = "Zwraca stronicowaną listę użytkowników z możliwością wyszukiwania.")
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    fun getAll(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
        @RequestParam(required = false) search: String?,
        @RequestParam(defaultValue = "false") clientsOnly: Boolean,
        @RequestParam(defaultValue = "name") sortBy: String,
        @RequestParam(defaultValue = "asc") sortDir: String
    ): ResponseEntity<Page<UserDTO>> {
        return ResponseEntity.ok(
            userService.getAllUsers(page, size, search, clientsOnly, sortBy, sortDir)
        )
    }

    @Operation(summary = "Utwórz użytkownika", description = "Publiczny endpoint do tworzenia konta.")
    @PostMapping
    fun create(@Valid @RequestBody request: CreateUserRequest): ResponseEntity<UserDTO> {
        return ResponseEntity(userService.createUser(request), HttpStatus.CREATED)
    }

    @Operation(summary = "Pobierz użytkownika po ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/{id:\\d+}")
    fun getById(@PathVariable id: Long, authentication: Authentication): ResponseEntity<UserDTO> {
        val authUserId = (authentication.details as? Number)?.toLong()
        if (authentication.authorities.none { it.authority == "ROLE_ADMIN" } && authUserId != id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }
        return ResponseEntity.ok(userService.getUserById(id))
    }

    @Operation(summary = "Usuń użytkownika (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        userService.deleteUser(id)
        return ResponseEntity.noContent().build()
    }

    @Operation(summary = "Utwórz operatora (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/operator")
    fun createOperator(@Valid @RequestBody request: CreateUserRequest): ResponseEntity<UserDTO> {
        return ResponseEntity(userService.createOperator(request), HttpStatus.CREATED)
    }

    @Operation(summary = "Konfiguracja MFA", description = "Generuje sekret i QR code do włączenia 2FA.")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @PostMapping("/{id}/mfa-setup")
    fun setupMfa(@PathVariable id: Long, authentication: Authentication): ResponseEntity<MfaSetupResponse> {
        val authUserId = (authentication.details as? Number)?.toLong()
        if (authentication.authorities.none { it.authority == "ROLE_ADMIN" } && authUserId != id) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }
        return ResponseEntity.ok(userService.generateMfaSetup(id))
    }

    @Operation(summary = "Potwierdzenie MFA", description = "Weryfikuje pierwszy kod i aktywuje 2FA na koncie.")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @PostMapping("/{id}/mfa-confirm")
    fun confirmMfa(
        @PathVariable id: Long,
        @RequestBody request: com.parkingplus.auth.MfaConfirmRequest,
        authentication: Authentication
    ): ResponseEntity<String> {
        val authUserId = (authentication.details as? Number)?.toLong()
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

    @Operation(summary = "Pobierz profil zalogowanego użytkownika")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @GetMapping("/me")
    fun getCurrentUser(authentication: Authentication): ResponseEntity<UserDTO> {
        val authUserId = (authentication.details as? Number)?.toLong()
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()

        return ResponseEntity.ok(userService.getUserById(authUserId))
    }

    @Operation(summary = "Doładuj saldo / Zmień balans")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
    @PatchMapping("/{id}/balance")
    fun addBalance(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateBalanceRequest,
        authentication: Authentication
    ): ResponseEntity<UserDTO> {

        val authUserId = (authentication.details as? Number)?.toLong()

        if (
            authentication.authorities.none { it.authority == "ROLE_ADMIN" } &&
            authUserId != id
        ) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        return ResponseEntity.ok(
            userService.addBalance(id, request.amount)
        )
    }
}
