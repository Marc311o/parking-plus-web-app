package com.parkingplus.users

import com.parkingplus.users.requests.CreateUserRequest

fun UserEntity.toDTO() = UserDTO(
    id = id,
    name = name,
    surname = surname,
    email = email,
    isOperator = isOperator
)


fun CreateUserRequest.toEntity(hashedPassword: String) = UserEntity(
    name = name,
    surname = surname,
    email = email,
    password = hashedPassword,
    isOperator = false
)