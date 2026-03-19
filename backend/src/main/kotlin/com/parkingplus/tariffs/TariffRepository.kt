package com.parkingplus.tariffs

import org.springframework.data.jpa.repository.JpaRepository

interface TariffRepository : JpaRepository<TariffEntity, Long> {
    fun findAllByIsDailyTrue(isDaily: Boolean): List<TariffEntity>
//    szuka pojedynczego wiersza z bazy (istotne na później)
    fun findByIsDailyAndDayOfWeekAndStartHourAndEndHour(isDaily: Boolean, dayOfWeek: String, startHour: Int, endHour: Int): List<TariffEntity>
}