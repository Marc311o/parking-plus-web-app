package com.parkingplus.email

import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class EmailService(
    private val mailSender: JavaMailSender
) {

    fun sendPasswordResetEmail(to: String, resetLink: String) {
        val message = SimpleMailMessage()

//      if using gmail, message.from doesn't matter - it will be overwritten, but it is required to set it.
//        TODO: change the email content and subject to something more appropriate, maybe add some html formatting?
        message.from = "noreply@parkingplus.pl"
        message.setTo(to)
        message.subject = "ParkingPlus - Resetowanie hasła"
        message.text = """
            Witaj,
            
            Otrzymaliśmy prośbę o zresetowanie hasła dla Twojego konta w systemie ParkingPlus.
            Kliknij w poniższy link, aby ustawić nowe hasło:
            
            $resetLink
            
            Link jest ważny przez 15 minut. Jeśli to nie Ty prosiłeś o zmianę hasła, zignoruj tę wiadomość.
            
            Pozdrawiamy,
            Zespół ParkingPlus
        """.trimIndent()

        mailSender.send(message)
    }
}