import React, {useEffect, useState} from "react";
import {useNavigate, Link} from "react-router-dom";
import {Link as RouterLink} from "react-router-dom";
import {Link as MuiLink, Stack, Typography} from "@mui/material";
import { useIntl } from "react-intl";

import PersonFill from '@assets/PersonFillPurple.svg';
import {Box, Alert, CircularProgress, Button} from "@mui/material";
import {useAuthStore} from "../../store/useAuthStore";
import AuthPasswordField from "../../components/Login/AuthPasswordField.tsx";
import AuthDefaultField from "../../components/Login/AuthDefaultField.tsx";
import ButtonPurple from "../../components/Login/ButtonPurple.tsx";
import ButtonWhite from "../../components/Login/ButtonWhite.tsx";

const API_URL = (() => {
    const apiUrl = import.meta.env.VITE_API_URL;

    if (typeof apiUrl !== "string" || apiUrl.trim() === "") {
        throw new Error("Missing required environment variable: VITE_API_URL");
    }

    return apiUrl;
})();
const Login = () => {
    const {formatMessage} = useIntl();

    const setToken = useAuthStore((state) => state.setToken);
    const logout = useAuthStore((state) => state.logout);

    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [step, setStep] = useState<'login' | '2fa'>('login');

    const [preToken, setPreToken] = useState('');
    const [totpCode, setTotpCode] = useState('');


    const [error, setError] = useState("");
    const [verifyError, setVerifyError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);

    const [emailEmptyError, setEmailEmptyError] = useState(false);
    const [passwordEmptyError, setPasswordEmptyError] = useState(false);


    const areEmptyFields = () => {
        let hasError = false;

        if (!email.trim()) {
            setEmailEmptyError(true);
            hasError = true;
        }

        if (!password.trim()) {
            setPasswordEmptyError(true);
            hasError = true;
        }

        return hasError;
    };

    // input control

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        switch (name) {
            case "email":
                setEmail(value);
                if (value.trim()) setEmailEmptyError(false);
                break;

            case "password":
                setPassword(value);
                if (value.trim()) setPasswordEmptyError(false);
                break;
        }
    };


    const navigate = useNavigate();


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        if (areEmptyFields()) {
            setError("Wszystkie pola muszą być wypełnione")
            setLoading(false)
            return
        }

        try {
            const result = await login(email, password);

            if (result.mfa) {
                setPreToken(result.preAuthToken);
                setStep('2fa');
            } else {
                setToken(result.token);
                navigate("/dashboard");
            }

        } catch (err) {
            setError("Nieprawidłowy e-mail lub hasło");
        } finally {
            setLoading(false);
        }
    };


    const handle2FASubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setVerifyLoading(true);
        setVerifyError("");

        try {
            const response = await fetch(`${API_URL}/api/auth/verify-mfa`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    preAuthToken: preToken,
                    code: totpCode
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error("Błąd logowania");
            }

            setToken(data.token);
            navigate("/");

        } catch (err) {
            setVerifyError("Niepoprawny kod 2FA!");
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleCreateAccount = () => {
        navigate("/createnewaccount");
    };


    async function login(email: string, password: string) {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({email, password})
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error("Niepoprawny e-mail lub hasło");
        }

        if (data.mfaRequired) {
            return {
                mfa: true,
                preAuthToken: data.preAuthToken
            };
        }

        return {
            mfa: false,
            token: data.token
        };
    }


    if (step === '2fa') {
        return (
            <Box sx={{width: '100%', minHeight: '100%'}}>
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
                            mt: 4,
                        }}
                    >
                        {formatMessage({ id: 'logins.2fa.title' })}
                    </Typography>

                    <Typography sx={{mt: 3}}>
                        {formatMessage({ id: 'logins.2fa.description' })}
                    </Typography>

                    <Box component="form" onSubmit={handle2FASubmit}
                         sx={{
                             display: "flex",
                             flexDirection: "column",
                             alignItems: "center",
                         }}
                    >

                        {verifyError && <Alert severity="error">{verifyError}</Alert>}

                        <Stack
                            spacing={2}
                            sx={{
                                mt: "55px",
                                alignItems: "flex-start",
                                width: 350,
                            }}
                        >

                            <AuthDefaultField
                                name="totpCode"
                                label={formatMessage({ id: 'logins.2fa.codeLabel' })}
                                placeholder={formatMessage({ id: 'logins.2fa.codePlaceholder' })}
                                value={totpCode}
                                onChange={(e) =>
                                    setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                                }
                                disabled={false}

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

                            <ButtonWhite type="submit" onClick={handle2FASubmit}
                                         disabled={verifyLoading || totpCode.length !== 6}>
                                {verifyLoading ? <CircularProgress size={20}/> : formatMessage({ id: 'logins.2fa.verifyButton' })}
                            </ButtonWhite>

                            <ButtonWhite type="button" onClick={() => setStep('login')} disabled={verifyLoading}>
                                {formatMessage({ id: 'logins.2fa.backButton' })}
                            </ButtonWhite>

                        </Stack>

                    </Box>

                </Box>
            </Box>
        );
    }


    return (
        <Box sx={{width: '100%', minHeight: '100%'}}>
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
                    {formatMessage({ id: 'logins.login.title' })}
                </Typography>

                <Box
                    component="img"
                    src={PersonFill}
                    alt="Person Fill"
                    sx={{width: '100%', maxWidth: 150, mt: 5,}}
                />

                <Box component="form" onSubmit={handleLogin}
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

                        {error && <Alert severity="error">{error}</Alert>}

                        <AuthDefaultField
                            name={"email"}
                            label={formatMessage({ id: 'logins.login.emailLabel' })}
                            placeholder={formatMessage({ id: 'logins.login.emailPlaceholder' })}
                            value={email}
                            onChange={(e) => handleInputChange(e)}
                            disabled={loading}
                            error={emailEmptyError}
                        />

                        <AuthPasswordField
                            name="password"
                            label={formatMessage({ id: 'logins.login.passwordLabel' })}
                            placeholder={formatMessage({ id: 'logins.login.passwordPlaceholder' })}
                            value={password}
                            onChange={(e) => handleInputChange(e)}
                            disabled={loading}
                            error={passwordEmptyError}
                        />

                        <MuiLink
                            component={RouterLink}
                            to="/forgotpassword"
                            sx={{
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#5E076E",
                                textDecoration: "none",
                                cursor: "pointer",
                                textAlign: "right",
                                width: "100%",
                                display: "block",

                                "&:hover": {
                                    textDecoration: "underline",
                                },
                            }}
                        >
                            {formatMessage({ id: 'logins.login.passwordForgot' })}
                        </MuiLink>

                    </Stack>


                    <Stack
                        direction="row"
                        spacing={1.25}
                        alignItems="center"
                        sx={{
                            py: "5px",
                            mt: 1,
                            width: "100%",
                        }}
                    >
                        <ButtonPurple type="submit">
                            {formatMessage({ id: 'logins.login.loginButton' })}
                        </ButtonPurple>

                        <ButtonWhite onClick={handleCreateAccount}>
                            {formatMessage({ id: 'logins.login.newAccButton' })}
                        </ButtonWhite>
                    </Stack>
                </Box>

            </Box>
        </Box>
    );
};

export default Login;