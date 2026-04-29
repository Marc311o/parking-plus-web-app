import React, { useState } from "react";
import "./Login.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import renderIcon from "../../utils/RenderIcon";

import { Alert, Box } from "@mui/material";
import EyeOn from '@assets/eyeOn.svg';
import EyeOff from '@assets/eyeOff.svg';
import AuthPasswordField from "../../components/Login/AuthPasswordField.tsx";

const API_URL = import.meta.env.VITE_API_URL;

const ResetPasswordPage = () => {

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [passwordEmptyError, setPasswordEmptyError] = useState(false);
    const [passwordRepeatEmptyError, setPasswordRepeatEmptyError] = useState(false);


    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/login");
    };

    const handleResetPassword = async () => {
        setError("");

        if (!token) {
            setError("Brak tokenu resetującego");
            return;
        }

        if (!password || !passwordRepeat) {
            setError("Wszystkie pola są wymagane");
            if (!password)
                setPasswordEmptyError(true)
            if (!passwordRepeat)
                setPasswordRepeatEmptyError(true)
            return;
        }

        if (password.length < 6) {
            setError("Hasło powinno mieć min. 6 znaków");
            return;
        }

        if (password !== passwordRepeat) {
            setError("Hasła nie są identyczne");
            return;
        }


        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: password,
                }),
            });

            if (!res.ok) {
                throw new Error("Token jest nieprawidłowy lub wygasł");
            }

            alert("Hasło zostało zmienione poprawnie");
            navigate("/login");

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Wystąpił nieznany błąd");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        switch (name) {
            case "password":
                setPassword(value);
                if (value.trim()) setPasswordEmptyError(false);
                break;

            case "passwordRepeat":
                setPasswordRepeat(value);
                if (value.trim()) setPasswordRepeatEmptyError(false);
                break;
        }
    };

    return (
        <Box sx={{ width: '100%', minHeight: '100vh' }}>
            <div className='container'>

                <h1>RESET HASŁA</h1>

                <div className='inputs'>

                    {error && <Alert severity="error">{error}</Alert>}

                    {/* password */}
                    <AuthPasswordField
                        name="password"
                        label="Nowe hasło"
                        placeholder="Nowe hasło"
                        value={password}
                        onChange={(e) => handleInputChange(e)}
                        disabled={loading}
                        error={passwordEmptyError}
                    />

                    {/* password repeat */}
                    <AuthPasswordField
                        name="passwordRepeat"
                        label="Powtórz nowe hasło"
                        placeholder="Powtórz nowe hasło"
                        value={passwordRepeat}
                        onChange={(e) => handleInputChange(e)}
                        disabled={loading}
                        error={passwordRepeatEmptyError}
                    />

                </div>

                <div className='buttons'>
                    <button
                        onClick={handleResetPassword}
                        className='signupBtn'
                        disabled={loading}
                    >
                        {loading ? "Resetowanie..." : "Resetuj hasło"}
                    </button>

                    <button onClick={handleBack} className='signupBtn'>
                        Wróć
                    </button>
                </div>
            </div>
        </Box>
    );
};

export default ResetPasswordPage;