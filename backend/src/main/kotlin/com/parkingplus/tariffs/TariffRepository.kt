package com.parkingplus.tariffs

import org.springframework.data.jpa.repository.JpaRepository

interface TariffRepository : JpaRepository<TariffEntity, Long> {
    fun getDailyPrice(isDaily: Boolean): List<TariffEntity>
    fun getHourlyPrice(isDaily: Boolean, dayOfWeek: String, startHour: Int, endHour: Int): List<TariffEntity>
}