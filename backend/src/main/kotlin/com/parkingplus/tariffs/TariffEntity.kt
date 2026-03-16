package com.parkingplus.tariffs

@Entity
@Table(name = "tariffs")
data class TariffEntity(

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id", nullable = false)
//    val id: Long = 0,
// not sure if it shouldnt be there or sth


    @Column(name = "daily", nullable = false)
    val isDaily: Boolean,

    @Column(name = "day_of_week")
    val dayOfWeek: String, // or int?

    @Column(name = "start_hour")
    val startHour: Int,

    @Column(name = "start_hour")
    val endHour: Int,

    @Column(name = "is_first_hour")
    val isFirstHour: Boolean,

    @Column(name = "price", nullable = false)
    val price: Double

)
