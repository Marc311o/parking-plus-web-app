package com.parkingplus.tariffs

fun TariffEntity.toDTO() = TariffDTO(
    id = id,
    isDaily = isDaily,
    dayOfWeek = dayOfWeek,
    startHour = startHour,
    endHour = endHour,
    isFirstHour = isFirstHour,
    price = price
)

fun TariffDTO.toEntity() = TariffEntity(
    isDaily = isDaily,
    dayOfWeek = dayOfWeek ?: "ALL",
    startHour = startHour,
    endHour = endHour,
    isFirstHour = isFirstHour,
    price = price
)