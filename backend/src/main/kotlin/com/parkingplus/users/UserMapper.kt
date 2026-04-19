package com.parkingplus.users

import com.parkingplus.users.requests.CreateUserRequest

fun UserEntity.toDTO() = UserDTO(
    id = id,
    name = name,
    surname = surname,
    email = email,
    isOperator = isOperator
)

fun CreateUserRequest.toEntity() = UserEntity(
    name = name,
    surname = surname,
    email = email,

    // TODO: tutaj bedzie pozniej hash
    password = password,

    isOperator = isOperator
)