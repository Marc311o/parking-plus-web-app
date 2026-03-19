package com.parkingplus

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ParkingPlusApplication

fun main(args: Array<String>) {
    runApplication<ParkingPlusApplication>(*args)
}