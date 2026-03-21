package com.parkingplus

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import io.github.cdimascio.dotenv.Dotenv

@SpringBootApplication
open class ParkingPlusApplication

fun main(args: Array<String>) {


    val dotenv = Dotenv.configure()
        .directory("./")
        .ignoreIfMalformed()
        .ignoreIfMissing()
        .load()

    dotenv.entries().forEach { entry ->
        System.setProperty(entry.key, entry.value)
    }

    runApplication<ParkingPlusApplication>(*args)
}