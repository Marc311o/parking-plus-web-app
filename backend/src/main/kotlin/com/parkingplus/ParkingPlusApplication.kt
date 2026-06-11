package com.parkingplus

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
open class ParkingPlusApplication

fun main(args: Array<String>) {
    runApplication<ParkingPlusApplication>(*args)
}