import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import QuestionMark from '@assets/questionMark.svg';
import {Alert, Box} from "@mui/material";

const ForgotPasswordPage = () => {

    const [error, setError] = useState("");

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const [emailEmptyError, setEmailEmptyError] = useState(false);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/login");
    };

    const handleSendEmail = async () => {
        if (!email) {
            setError("Uzupełnij adres email!")
            setEmailEmptyError(true)
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            if (!res.ok) {
                throw new Error("Błąd wysyłania");
            }

            alert("Jeśli konto istnieje, link do resetu został wysłany");
            navigate("/login");

        } catch (err) {
            console.error(err);
            setError("Nie udało się wysłać maila")
        } finally {
            setLoading(false);
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        switch (name) {
            case "email":
                setEmail(value);
                if (value.trim()) setEmailEmptyError(false);
                break;
        }
    };

    return (
        <div className='container'>

            <h1>RESET HASŁA</h1>

            <Box
                component="img"
                src={QuestionMark}
                alt="Question Mark"
                sx={{
                    width: '100%',
                    maxWidth: 150,
                }}
            />

            <div className='inputs'>

                <h3>
                    Wprowadź adres e-mail przypisany do Twojego konta.
                    Na ten adres zostanie wysłany link umożliwiający zresetowanie hasła.
                </h3>

                {error && <Alert severity="error">{error}</Alert>}


                {/* email */}
                <label className='inputTitle'>E-mail</label>
                <div className='input'>
                    <input
                        name="email"
                        type="email"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => handleInputChange(e)}
                        className={emailEmptyError ? "errorInput" : ""}
                    />
                </div>

            </div>

            <div className='buttons'>
                <button
                    onClick={handleSendEmail}
                    className='signupBtn'
                    disabled={loading}
                >
                    {loading ? "Wysyłanie..." : "Resetuj hasło"}
                </button>

                <button onClick={handleBack} className='signupBtn'>
                    Wróć
                </button>
            </div>

        </div>
    );
};

export default ForgotPasswordPage;