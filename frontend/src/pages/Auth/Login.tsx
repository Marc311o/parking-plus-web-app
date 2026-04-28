import React, {useEffect, useState} from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";

import PersonFill from '@assets/PersonFillPurple.svg';
import {Box, Alert, CircularProgress} from "@mui/material";
import EyeOn from '@assets/eyeOn.svg';
import EyeOff from '@assets/eyeOff.svg';
import renderIcon from "../../utils/RenderIcon";
import { useAuthStore } from "../../store/useAuthStore";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {


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

    useEffect(() => {
        logout();
    }, []);


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
        const { name, value } = e.target;

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

        if (areEmptyFields()){
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
            body: JSON.stringify({ email, password })
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
            <Box sx={{ width: '100%', minHeight: '100%' }}>
                <div className='container'>

                    <h1>WERYFIKACJA 2FA</h1>

                    <p>Wpisz kod z aplikacji Authenticator</p>

                    <form onSubmit={handle2FASubmit}>

                        {verifyError && <Alert severity="error">{verifyError}</Alert>}

                        <div className='inputs'>
                            <div className='input'>
                                <input
                                    type="text"
                                    placeholder="6-cyfrowy kod"
                                    value={totpCode}
                                    onChange={(e) => setTotpCode(e.target.value)}
                                    maxLength={6}
                                />
                            </div>
                        </div>

                        <div className='buttons'>
                            <button
                                type="submit"
                                className='loginBtn'
                                disabled={verifyLoading || totpCode.length !== 6}
                            >
                                {verifyLoading ? <CircularProgress size={20} /> : "Weryfikuj"}
                            </button>

                            <button
                                type="button"
                                className='signupBtn'
                                onClick={() => setStep('login')}
                                disabled={verifyLoading}
                            >
                                Wróć
                            </button>
                        </div>

                    </form>

                </div>
            </Box>
        );
    }


    return (
        <Box sx={{width: '100%', minHeight: '100%'}}>
            <div className='container'>

                <h1>ZALOGUJ SIĘ</h1>

                <Box
                    component="img"
                    src={PersonFill}
                    alt="Person Fill"
                    sx={{width: '100%', maxWidth: 150}}
                />

                <div className='inputs'>

                    {error && <Alert severity="error">{error}</Alert>}

                    <label className='inputTitle'>Login</label>
                    <div className='input'>
                        <input
                            name="email"
                            type="text"
                            placeholder="E-mail"
                            value={email}
                            onChange={handleInputChange}
                            className={emailEmptyError ? "errorInput" : ""}
                        />
                    </div>

                    <label className='inputTitle'>Hasło</label>
                    <div className='input passwordBox'>
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Hasło"
                            value={password}
                            onChange={handleInputChange}
                            className={passwordEmptyError ? "errorInput" : ""}
                        />

                        <span
                            className="toggleIcon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? renderIcon(EyeOff) : renderIcon(EyeOn)}
                        </span>
                    </div>

                    <Link to="/forgotpassword" className="forgotPasswordText">
                        Nie pamiętam hasła
                    </Link>

                </div>

                <div className='buttons'>
                    <button
                        onClick={handleLogin}
                        className='loginBtn'
                        disabled={loading}
                    >
                        {loading ? "Logowanie..." : "Zaloguj się"}
                    </button>

                    <button
                        onClick={handleCreateAccount}
                        className='signupBtn'
                    >
                        Utwórz konto
                    </button>
                </div>

            </div>
        </Box>
    );
};

export default Login;