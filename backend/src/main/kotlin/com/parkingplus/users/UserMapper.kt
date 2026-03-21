package com.parkingplus.users

fun UserEntity.toDTO() = UserDTO(
    id = id,
    name = name,
    surname = surname,
    email = email,
    isOperator = isOperator
)

fun UserDTO.toEntity(password: String) = UserEntity(
    name = name,
    surname = surname,
    email = email,
    password = password,
    isOperator = isOperator
)