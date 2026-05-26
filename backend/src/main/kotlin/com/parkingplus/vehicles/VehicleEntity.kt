package com.parkingplus.vehicles

import com.parkingplus.users.UserEntity
import com.parkingplus.vehicles.enums.CarType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table

@Entity
@Table(name = "vehicles")
class VehicleEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_id")
    val id: Long? = null,

    @Column(name = "license_plate", nullable = false, unique = true)
    var licensePlate: String,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    var owner: UserEntity,

    @Enumerated(EnumType.STRING)
    @Column(name = "car_type", nullable = false)
    var carType: CarType,

    @Column(name = "is_active", nullable = false)
    var isActive: Boolean = true
)