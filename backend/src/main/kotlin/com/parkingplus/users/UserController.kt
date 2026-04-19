package com.parkingplus.users

import com.parkingplus.users.requests.CreateUserRequest
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
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
    fun getById(@PathVariable id: Long): ResponseEntity<UserDTO> =
        ResponseEntity.ok(userService.getUserById(id))

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
}