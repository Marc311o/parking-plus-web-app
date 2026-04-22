import React, {useState} from "react";
import "./Login.css";
import {useNavigate} from "react-router-dom";

import PersonFill from '@assets/PersonFillPurple.svg';
import {Box, Alert, CircularProgress} from "@mui/material";
import EyeOn from '@assets/eyeOn.svg';
import EyeOff from '@assets/eyeOff.svg';
import renderIcon from "../../utils/RenderIcon";

const Login = () => {

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

    const navigate = useNavigate();


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const result = await login(email, password);

            if (result.mfa) {
                setPreToken(result.preAuthToken);
                setStep('2fa');
            } else {
                navigate("/");
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    const handle2FASubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setVerifyLoading(true);
        setVerifyError("");

        try {
            const response = await fetch("http://localhost:8080/api/auth/verify-mfa", {
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
                throw new Error(data.message || "Błąd logowania");
            }

            localStorage.setItem("token", data.token);

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

        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({email, password})
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Błąd logowania");
        }

        if (data.mfaRequired) {
            return {
                mfa: true,
                preAuthToken: data.preAuthToken
            };
        }

        localStorage.setItem("token", data.token);
        return {mfa: false};
    }


    if (step === '2fa') {
        return (
            <Box sx={{width: '100%', minHeight: '100%'}}>
                <div className='container'>

                    <h1>WERYFIKACJA 2FA</h1>

                    <p>Wpisz kod z aplikacji Authenticator</p>

                    {/*<form onSubmit={handle2FASubmit}>*/}

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
                                {verifyLoading ? <CircularProgress size={20}/> : "Weryfikuj"}
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

                    {/*</form>*/}

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
                            type="text"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <label className='inputTitle'>Hasło</label>
                    <div className='input passwordBox'>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Hasło"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <span
                            className="toggleIcon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? renderIcon(EyeOff) : renderIcon(EyeOn)}
                        </span>
                    </div>

                    <a href="/forgotpassword" className="forgotPasswordText">
                        Nie pamiętam hasła
                    </a>

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