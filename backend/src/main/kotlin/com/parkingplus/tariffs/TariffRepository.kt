package com.parkingplus.tariffs

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface TariffRepository : JpaRepository<TariffEntity, Long> {
    fun findAllByIsDaily(isDaily: Boolean): List<TariffEntity>
    fun findByIsDailyAndDayOfWeekAndStartHourAndEndHour(isDaily: Boolean, dayOfWeek: Int, startHour: Int, endHour: Int): List<TariffEntity>
}