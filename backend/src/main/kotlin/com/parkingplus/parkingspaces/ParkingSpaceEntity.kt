package com.parkingplus.parkingspaces

import com.parkingplus.parkingspaces.enums.SpaceType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "parking_space")
class ParkingSpaceEntity(
    @Id
    @Column(name = "parking_space_id", nullable = false)
    val id: String,

    @Column(name = "status", nullable = false)
    var status: String,

    @Enumerated(EnumType.STRING)
    @Column(name = "space_type", nullable = false)
    var spaceType: SpaceType,

    @Column(name = "level", nullable = false)
    var level: Int = 0,
)