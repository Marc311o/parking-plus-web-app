import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import QuestionMark from '@assets/questionMark.svg';
import { useIntl } from "react-intl";
import {Alert, Box, Stack, Typography} from "@mui/material";
import AuthDefaultField from "@components/Login/AuthDefaultField.tsx";
import ButtonWhite from "@components/Login/ButtonWhite.tsx";

const API_URL = import.meta.env.VITE_API_URL;

const ForgotPasswordPage = () => {
    const {formatMessage} = useIntl();

    const [error, setError] = useState("");

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const [emailEmptyError, setEmailEmptyError] = useState(false);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/login");
    };

    const handleSendEmail = async () => {
        if (!email.trim()) {
            setError("Uzupełnij adres email!")
            setEmailEmptyError(true)
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({email}),
            });

            if (!res.ok) {
                throw new Error("Błąd wysyłania");
            }

            alert("Jeśli konto istnieje, link do resetu został wysłany");
            navigate("/login");

        } catch (err) {
            setError("Nie udało się wysłać maila")
        } finally {
            setLoading(false);
        }
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        switch (name) {
            case "email":
                setEmail(value);
                if (value.trim()) setEmailEmptyError(false);
                break;
        }
    };

    return (
        <Box
            sx={{
                width: "100%",
                backgroundColor: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "20px 0",
                minHeight: "100vh",
                boxSizing: "border-box",
            }}
        >

            <Typography
                variant="h4"
                component="h1"
                sx={{
                    color: "#5E076E",
                    fontFamily: `"Poppins", "Segoe UI", Arial, sans-serif`,
                    fontWeight: 600,
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    mt: 2,
                }}
            >
                {formatMessage({ id: "logins.forgotPassword.title" })}
            </Typography>

            <Box
                component="img"
                src={QuestionMark}
                alt="Question Mark"
                sx={{width: '100%', maxWidth: 150, mt: 5,}}
            />

            <Box component="form" onSubmit={handleSendEmail}
                 sx={{
                     display: "flex",
                     flexDirection: "column",
                     alignItems: "center",
                 }}
            >
                <Stack
                    spacing={2}
                    sx={{
                        mt: "55px",
                        alignItems: "flex-start",
                        width: 350,
                    }}
                >

                    <Typography sx={{mt: 3}}>
                        {formatMessage({ id: "logins.forgotPassword.description" })}
                    </Typography>


                    {error && <Alert severity="error">{error}</Alert>}


                    {/* email */}
                    <AuthDefaultField
                        name={"email"}
                        label={formatMessage({ id: "logins.forgotPassword.emailLabel" })}
                        placeholder={formatMessage({ id: "logins.forgotPassword.emailPlaceholder" })}
                        value={email}
                        onChange={(e) => handleInputChange(e)}
                        disabled={loading}
                        error={emailEmptyError}
                    />

                </Stack>

                <Stack
                    direction="row"
                    spacing={1.25}
                    alignItems="center"
                    sx={{
                        py: "5px",
                        mt: 4,
                    }}
                >

                    <ButtonWhite type="submit" onClick={handleSendEmail} disabled={loading}>
                        {loading ? formatMessage({ id: "logins.forgotPassword.sendingButton" }) : formatMessage({ id: "logins.forgotPassword.resetButton" })}
                    </ButtonWhite>

                    <ButtonWhite type="button" onClick={handleBack}>
                        {formatMessage({ id: "logins.forgotPassword.backButton" })}
                    </ButtonWhite>

                </Stack>
            </Box>

        </Box>
    );
};

export default ForgotPasswordPage;