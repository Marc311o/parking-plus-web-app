package com.parkingplus.users

import com.parkingplus.auth.MfaSetupResponse
import com.parkingplus.security.TwoFactorAuthService
import com.parkingplus.users.requests.CreateUserRequest
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import java.math.BigDecimal

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val tfaService: TwoFactorAuthService,
    private val passwordValidator: com.parkingplus.security.validation.PasswordValidator
) {

    @Transactional(readOnly = true)
    fun getAllUsers(
        page: Int,
        size: Int,
        search: String?,
        clientsOnly: Boolean,
        sortBy: String,
        sortDir: String
    ): Page<UserDTO> {
        val direction = if (sortDir.equals("desc", ignoreCase = true)) Sort.Direction.DESC else Sort.Direction.ASC

        val validSortFields = listOf("name", "surname", "email")
        val normalizedSortBy = sortBy.lowercase()
        val actualSortBy = if (validSortFields.contains(normalizedSortBy)) normalizedSortBy else "name"

        val sort = Sort.by(direction, actualSortBy)
        val pageable = PageRequest.of(page, size, sort)

        return userRepository.findAllWithSearch(search, clientsOnly, pageable).map { it.toDTO() }
    }

    @Transactional
    fun createUser(request: CreateUserRequest): UserDTO {
        if (userRepository.existsByEmail(request.email)) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "Użytkownik z mailem ${request.email} już istnieje.")
        }

        passwordValidator.validate(request.password, listOf(request.name, request.surname, request.email))

        val hashedPassword = passwordEncoder.encode(request.password)
        val entity = request.toEntity(hashedPassword)

        return userRepository.save(entity).toDTO()
    }

    @Transactional
    fun createOperator(request: CreateUserRequest): UserDTO {
        if (userRepository.existsByEmail(request.email)) {
            throw ResponseStatusException(HttpStatus.CONFLICT, "Użytkownik z mailem ${request.email} już istnieje.")
        }

        passwordValidator.validate(request.password, listOf(request.name, request.surname, request.email))

        val hashedPassword = passwordEncoder.encode(request.password)
        val entity = request.toEntity(hashedPassword).apply {
            isOperator = true
        }

        return userRepository.save(entity).toDTO()
    }

    @Transactional(readOnly = true)
    fun getUserById(id: Long): UserDTO {
        return userRepository.findById(id)
            .map { it.toDTO() }
            .orElseThrow { NoSuchElementException("User with id: $id not found.") }
    }

    @Transactional
    fun deleteUser(id: Long) {
        if (!userRepository.existsById(id)) {
            throw NoSuchElementException("User with id: $id not found.")
        }
        userRepository.deleteById(id)
    }

    @Transactional
    fun generateMfaSetup(userId: Long): MfaSetupResponse {
        val user = userRepository.findById(userId).orElseThrow()

        val secret = tfaService.generateNewSecret()
        user.mfaSecret = secret
        userRepository.save(user)

        return MfaSetupResponse(
            secret = secret,
            qrCodeUri = tfaService.getQrCodeUri(secret, user.email)
        )
    }

    @Transactional
    fun confirmMfaSetup(userId: Long, code: String): Boolean {
        val user = userRepository.findById(userId).orElseThrow()
        val secret = user.mfaSecret ?: return false

        if (tfaService.isCodeValid(secret, code)) {
            user.isMfaEnabled = true
            userRepository.save(user)
            return true
        }
        return false
    }

    @Transactional
    fun addBalance(userId: Long, amount: BigDecimal): UserDTO {
        if (amount <= BigDecimal.ZERO) {
            throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Kwota musi być >= 0.01"
            )
        }

        val user = userRepository.findById(userId)
            .orElseThrow {
                NoSuchElementException("User with id: $userId not found.")
            }

        user.balance = user.balance.add(amount)

        return userRepository.save(user).toDTO()
    }
}