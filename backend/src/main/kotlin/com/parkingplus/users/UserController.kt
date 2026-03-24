package com.parkingplus.users

import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {

    @GetMapping
    fun getAll(): ResponseEntity<List<UserDTO>> =
        ResponseEntity.ok(userService.getAllUsers())

    @PostMapping
    fun create(@Valid @RequestBody dto: UserDTO, @RequestParam pass: String): ResponseEntity<UserDTO> {
        return ResponseEntity(userService.createUser(dto, pass), HttpStatus.CREATED)
    }

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResponseEntity<UserDTO> =
        ResponseEntity.ok(userService.getUserById(id))

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long): ResponseEntity<Void> {
        userService.deleteUser(id)
        return ResponseEntity.noContent().build()
    }
}