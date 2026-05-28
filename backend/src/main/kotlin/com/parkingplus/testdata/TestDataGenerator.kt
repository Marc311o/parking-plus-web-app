package com.parkingplus.testdata

import com.parkingplus.parkingspaces.ParkingSpaceEntity
import com.parkingplus.parkingspaces.ParkingSpaceRepository
import com.parkingplus.parkingspaces.enums.ParkingSpaceStatus
import com.parkingplus.parkingspaces.enums.SpaceType
import com.parkingplus.tariffs.TariffEntity
import com.parkingplus.tariffs.TariffRepository
import com.parkingplus.users.UserEntity
import com.parkingplus.users.UserRepository
import com.parkingplus.vehicles.VehicleEntity
import com.parkingplus.vehicles.VehicleRepository
import com.parkingplus.vehicles.enums.CarType
import com.parkingplus.parkinghistory.ParkingHistoryEntity
import com.parkingplus.parkinghistory.ParkingHistoryRepository
import com.parkingplus.transactions.TransactionEntity
import com.parkingplus.transactions.TransactionRepository
import com.parkingplus.transactions.enums.TransactionType
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.*
import kotlin.random.Random

@Component
class TestDataGenerator(
    private val userRepository: UserRepository,
    private val vehicleRepository: VehicleRepository,
    private val parkingSpaceRepository: ParkingSpaceRepository,
    private val tariffRepository: TariffRepository,
    private val parkingHistoryRepository: ParkingHistoryRepository,
    private val transactionRepository: TransactionRepository,
    private val passwordEncoder: PasswordEncoder,
    private val twoFactorAuthService: com.parkingplus.security.TwoFactorAuthService
) {

    private val firstNames = listOf(
        "Jan",
        "Anna",
        "Piotr",
        "Maria",
        "Krzysztof",
        "Katarzyna",
        "Andrzej",
        "Małgorzata",
        "Tomasz",
        "Agnieszka",
        "Michał",
        "Barbara",
        "Marcin",
        "Ewa",
        "Jakub",
        "Magdalena",
        "Adam",
        "Elżbieta",
        "Łukasz",
        "Joanna"
    )
    private val lastNames = listOf(
        "Nowak",
        "Kowalski",
        "Wiśniewski",
        "Wójcik",
        "Kowalczyk",
        "Kamiński",
        "Lewandowski",
        "Zieliński",
        "Szymański",
        "Woźniak",
        "Dąbrowski",
        "Kozłowski",
        "Jankowski",
        "Mazur",
        "Wojciechowski",
        "Kwiatkowski",
        "Krawczyk",
        "Kaczmarek",
        "Piotrowski",
        "Grabowski"
    )

    private val cityPrefixes =
        listOf("WA", "WI", "WB", "KR", "KK", "PO", "PY", "DW", "DL", "GD", "GA", "LU", "LZ", "ZS", "ZK", "BI")

    @Transactional
    fun generate() {
        println(">>> Sprawdzanie i generowanie danych testowych...")

        val users = generateUsers(100)
        val vehicles = generateVehicles(users)
        val spaces = generateParkingSpaces()
        val tariffs = generateTariffs()
        generateHistory(vehicles, spaces, tariffs)
        generateActiveSessions(vehicles, spaces)

        println(">>> Zakończono proces generowania/weryfikacji danych.")
    }

    private fun generateActiveSessions(vehicles: List<VehicleEntity>, spaces: List<ParkingSpaceEntity>) {
        val occupiedSpaces = spaces.filter { it.status == ParkingSpaceStatus.FREE }.shuffled().take(5)
        val now = LocalDateTime.now()

        for (space in occupiedSpaces) {
            val vehicle = vehicles.random()
            
            // Check if vehicle already has active session
            if (parkingHistoryRepository.existsByVehicleIdAndEndTimeIsNull(vehicle.id!!)) continue

            space.status = ParkingSpaceStatus.OCCUPIED
            parkingSpaceRepository.save(space)

            parkingHistoryRepository.save(
                ParkingHistoryEntity(
                    vehicle = vehicle,
                    parkingSpace = space,
                    startTime = now.minusHours(Random.nextLong(1, 5)).minusMinutes(Random.nextLong(0, 60)),
                    endTime = now.plusHours(Random.nextLong(1, 8)),
                    price = 0.0, // Will be calculated on exit
                    barrierPhotoPath = "/car_photos/car_${(vehicle.id ?: 0L) % 10}_barrier.png",
                    spotPhotoPath = "/car_photos/car_${(vehicle.id ?: 0L) % 10}_spot.png"
                )
            )
        }
        println(">>> Wygenerowano 5 aktywnych sesji parkowania.")
    }

    private fun generateUsers(count: Int): List<UserEntity> {
        val currentCount = userRepository.count()
        if (currentCount > 1) {
            println(">>> Użytkownicy już istnieją (liczba: $currentCount). Pomijam generowanie nowych.")
            return userRepository.findAll().filter { !it.isOperator }
        }

        val users = mutableListOf<UserEntity>()
        for (i in 1..count) {
            val name = firstNames.random()
            val surname = lastNames.random()
            val email = "${name.lowercase()}.${surname.lowercase()}.${Random.nextInt(1000, 9999)}@example.com"

            val isMfaEnabled = i <= 5
            val mfaSecret = if (isMfaEnabled) twoFactorAuthService.generateNewSecret() else null

            val user = UserEntity(
                name = name,
                surname = surname,
                email = email,
                password = passwordEncoder.encode("password123"),
                isOperator = false,
                isMfaEnabled = isMfaEnabled,
                mfaSecret = mfaSecret,
                balance = BigDecimal(Random.nextInt(50, 501))
            )
            users.add(userRepository.save(user))
        }
        println(">>> Wygenerowano ${users.size} użytkowników (w tym 5 z 2FA).")
        return users
    }

    private fun generateVehicles(users: List<UserEntity>): List<VehicleEntity> {
        val currentCount = vehicleRepository.count()
        if (currentCount > 0) {
            println(">>> Pojazdy już istnieją (liczba: $currentCount). Pomijam generowanie nowych.")
            return vehicleRepository.findAll()
        }

        val vehicles = mutableListOf<VehicleEntity>()
        for (user in users) {
            val carCount = Random.nextInt(1, 4)
            for (i in 1..carCount) {
                val plate = generateLicensePlate()

                // 10% EV, 5% Handicapped
                val rand = Random.nextInt(100)
                val carType = when {
                    rand < 5 -> CarType.REGULAR_HANDICAPED
                    rand < 15 -> CarType.EV_ABLEBODIED
                    else -> CarType.REGULAR_ABLEBODIED
                }

                val vehicle = VehicleEntity(
                    licensePlate = plate,
                    owner = user,
                    carType = carType
                )
                vehicles.add(vehicleRepository.save(vehicle))
            }
        }
        println(">>> Wygenerowano ${vehicles.size} pojazdów.")
        return vehicles
    }

    private fun generateLicensePlate(): String {
        val prefix = cityPrefixes.random()
        val suffix = (1..5).map { "0123456789".random() }.joinToString("")
        return "$prefix $suffix"
    }

    private fun generateParkingSpaces(): List<ParkingSpaceEntity> {
        val currentCount = parkingSpaceRepository.count()
        if (currentCount > 0) {
            println(">>> Miejsca parkingowe już istnieją (liczba: $currentCount). Pomijam generowanie nowych.")
            return parkingSpaceRepository.findAll()
        }

        val spaces = mutableListOf<ParkingSpaceEntity>()

        for (level in 0..1) {
            val prefix = if (level == 0) "A" else "B"
            for (i in 1..28) {
                val id = "$prefix%02d".format(i)
                val type = when (i) {
                    1, 2 -> SpaceType.REGULAR_HANDICAPED
                    13, 14 -> SpaceType.EV_ABLEBODIED
                    else -> SpaceType.REGULAR_ABLEBODIED
                }
                val space =
                    ParkingSpaceEntity(id = id, status = ParkingSpaceStatus.FREE, spaceType = type, level = level)
                spaces.add(parkingSpaceRepository.save(space))
            }
        }

        println(">>> Wygenerowano ${spaces.size} miejsc parkingowych.")
        return spaces
    }

    private fun generateTariffs(): List<TariffEntity> {
        val currentCount = tariffRepository.count()
        if (currentCount > 0) {
            println(">>> Taryfy już istnieją (liczba: $currentCount). Pomijam generowanie nowych.")
            return tariffRepository.findAll()
        }

        val tariffs = mutableListOf<TariffEntity>()
        for (day in 1..7) {
            tariffs.add(
                tariffRepository.save(
                    TariffEntity(
                        isDaily = true,
                        dayOfWeek = day,
                        startHour = 0,
                        endHour = 24,
                        isFirstHour = false,
                        price = 50.0
                    )
                )
            )
            tariffs.add(
                tariffRepository.save(
                    TariffEntity(
                        isDaily = false,
                        dayOfWeek = day,
                        startHour = 0,
                        endHour = 8,
                        isFirstHour = false,
                        price = 2.0
                    )
                )
            )
            tariffs.add(
                tariffRepository.save(
                    TariffEntity(
                        isDaily = false,
                        dayOfWeek = day,
                        startHour = 8,
                        endHour = 18,
                        isFirstHour = true,
                        price = 5.0
                    )
                )
            )
            tariffs.add(
                tariffRepository.save(
                    TariffEntity(
                        isDaily = false,
                        dayOfWeek = day,
                        startHour = 18,
                        endHour = 24,
                        isFirstHour = false,
                        price = 3.0
                    )
                )
            )
        }
        println(">>> Wygenerowano taryfy.")
        return tariffs
    }

    private fun generateHistory(
        vehicles: List<VehicleEntity>,
        spaces: List<ParkingSpaceEntity>,
        tariffs: List<TariffEntity>
    ) {
        val currentCount = parkingHistoryRepository.count()
        if (currentCount > 0) {
            println(">>> Historia parkowania już istnieje (liczba: $currentCount). Pomijam generowanie nowej.")
            return
        }

        val now = LocalDateTime.now()
        val historyEntries = mutableListOf<ParkingHistoryEntity>()

        for (i in 1..800) {
            val vehicle = vehicles.random()
            val matchingSpaces = spaces.filter {
                when (vehicle.carType) {
                    CarType.REGULAR_HANDICAPED -> it.spaceType == SpaceType.REGULAR_HANDICAPED
                    CarType.EV_ABLEBODIED -> it.spaceType == SpaceType.EV_ABLEBODIED
                    CarType.EV_HANDICAPED -> it.spaceType == SpaceType.EV_ABLEBODIED || it.spaceType == SpaceType.REGULAR_HANDICAPED
                    else -> it.spaceType == SpaceType.REGULAR_ABLEBODIED
                }
            }

            if (matchingSpaces.isEmpty()) continue
            val space = matchingSpaces.random()

            val daysAgo = Random.nextLong(0, 30)
            val hoursAgo = Random.nextLong(0, 24)
            val startTime = now.minusDays(daysAgo).minusHours(hoursAgo)
            val durationHours = Random.nextLong(1, 13)
            val endTime = startTime.plusHours(durationHours)

            val overlaps = historyEntries.any {
                it.parkingSpace.id == space.id &&
                        (startTime.isBefore(it.endTime) && endTime.isAfter(it.startTime))
            }

            if (!overlaps && endTime.isBefore(now)) {
                val price = calculatePrice(startTime, endTime, tariffs)

                val entry = ParkingHistoryEntity(
                    vehicle = vehicle,
                    parkingSpace = space,
                    startTime = startTime,
                    endTime = endTime,
                    price = price,
                    barrierPhotoPath = "/car_photos/car_${(vehicle.id ?: 0L) % 10}_barrier.png",
                    spotPhotoPath = "/car_photos/car_${(vehicle.id ?: 0L) % 10}_spot.png"
                )
                historyEntries.add(parkingHistoryRepository.save(entry))

                transactionRepository.save(
                    TransactionEntity(
                        user = vehicle.owner,
                        type = TransactionType.WITHDRAWAL,
                        amount = price.toFloat(),
                        realisedAt = endTime
                    )
                )

                transactionRepository.save(
                    TransactionEntity(
                        user = vehicle.owner,
                        type = TransactionType.DEPOSIT,
                        amount = (price + Random.nextInt(20, 100)).toFloat(),
                        realisedAt = startTime.minusMinutes(10)
                    )
                )
            }
        }
        println(">>> Wygenerowano ${historyEntries.size} wpisów historycznych.")
    }

    private fun calculatePrice(start: LocalDateTime, end: LocalDateTime, tariffs: List<TariffEntity>): Double {
        val durationHours = java.time.Duration.between(start, end).toHours().toInt().coerceAtLeast(1)
        val dayOfWeek = start.dayOfWeek.value // 1 (Mon) to 7 (Sun)
        val startHour = start.hour

        val dailyTariff = tariffs.find { it.isDaily && it.dayOfWeek == dayOfWeek }

        var totalCost = 0.0
        var currentHour = start

        for (h in 0 until durationHours) {
            val hourOfDay = currentHour.hour
            val isFirstHour = (h == 0)

            val tariff = tariffs.find {
                !it.isDaily &&
                        it.dayOfWeek == currentHour.dayOfWeek.value &&
                        hourOfDay >= it.startHour && hourOfDay < it.endHour &&
                        (it.isFirstHour == isFirstHour || !it.isFirstHour)
            }
                ?: tariffs.find { !it.isDaily && it.dayOfWeek == currentHour.dayOfWeek.value && hourOfDay >= it.startHour && hourOfDay < it.endHour }

            totalCost += tariff?.price ?: 5.0
            currentHour = currentHour.plusHours(1)
        }

        return if (dailyTariff != null && totalCost > dailyTariff.price) dailyTariff.price else totalCost
    }
}
