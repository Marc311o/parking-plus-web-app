import React, {useState} from "react";
import "./Login.css";
import {useNavigate} from "react-router-dom";
import renderIcon from "../../utils/RenderIcon";

import PersonFill from '@assets/PersonFillPurple.svg';
import {Alert, Box} from "@mui/material";
import EyeOn from '@assets/eyeOn.svg';
import EyeOff from '@assets/eyeOff.svg';


const CreateNewAccountPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);

    const [error, setError] = useState("");
    const [verifyError, setVerifyError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);


    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");

    const [nameEmptyError, setNameEmptyError] = useState(false);
    const [surnameEmptyError, setSurnameEmptyError] = useState(false);
    const [emailEmptyError, setEmailEmptyError] = useState(false);
    const [passwordEmptyError, setPasswordEmptyError] = useState(false);
    const [passwordRepeatEmptyError, setPasswordRepeatEmptyError] = useState(false);


    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/login");
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // ustawianie wartości
        switch (name) {
            case "name":
                setName(value);
                if (value.trim()) setNameEmptyError(false);
                break;

            case "surname":
                setSurname(value);
                if (value.trim()) setSurnameEmptyError(false);
                break;

            case "email":
                setEmail(value);
                if (value.trim()) setEmailEmptyError(false);
                break;

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

    const resetEmptyFieldErrors = () => {
        setNameEmptyError(false);
        setSurnameEmptyError(false);
        setEmailEmptyError(false);
        setPasswordEmptyError(false);
        setPasswordRepeatEmptyError(false);
    }

    const areEmptyFields = () => {
        let hasError = false;


        if (!name.trim()) {
            setNameEmptyError(true);
            hasError = true;
        }

        if (!surname.trim()) {
            setSurnameEmptyError(true);
            hasError = true;
        }

        if (!email.trim()) {
            setEmailEmptyError(true);
            hasError = true;
        }

        if (!password.trim()) {
            setPasswordEmptyError(true);
            hasError = true;
        }

        if (!passwordRepeat.trim()) {
            setPasswordRepeatEmptyError(true);
            hasError = true;
        }

        return hasError;
    };

    const handleCreateAccount = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        resetEmptyFieldErrors()


        try {

            if (areEmptyFields()) {
                throw new Error("Wszystkie pola są wymagane");
            }

            if (!isValidEmail(email)) {
                throw new Error("Niepoprawny adres e-mail!");
            }

            if (password.length < 6) {
                throw new Error("Hasło powinno mieć min. 6 znaków!")
            }

            if (password != passwordRepeat) {
                throw new Error("Hasła nie są identyczne!")
            }

            const result = await createNewAcc(name, surname, email, password);

            navigate("/login");

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }

    };

    async function createNewAcc(name: string, surname: string, email: string, password: string) {
        const response = await fetch("http://localhost:8080/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({name, surname, email, password})
        });

        if (!response.ok) {
            throw new Error("Na podany e-mail jest już założone inne konto!");
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error("Nie można założyć konta!");
        }
    }


    return (

        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
            }}
        >

            <div className='container'>


                <h1>ZAŁÓŻ KONTO</h1>

                <Box
                    component="img"
                    src={PersonFill}
                    alt="Person Fill"
                    sx={{
                        width: '100%',
                        maxWidth: 150,
                    }}
                />

                <div className='inputs'>

                    {error && <Alert severity="error">{error}</Alert>}

                    {/*name*/}
                    <label className='inputTitle'>Imię</label>
                    <div className='input'>
                        <input
                            name="name"
                            type="text"
                            placeholder="Imię"
                            value={name}
                            onChange={handleInputChange}
                            className={nameEmptyError ? "errorInput" : ""}
                        ></input>
                    </div>

                    {/*surname*/}
                    <label className='inputTitle'>Nazwisko</label>
                    <div className='input'>
                        <input
                            name="surname"
                            type="text"
                            placeholder="Nazwisko"
                            value={surname}
                            onChange={handleInputChange}
                            className={surnameEmptyError ? "errorInput" : ""}>
                        </input>
                    </div>

                    {/*mail*/}
                    <label className='inputTitle'>Login</label>
                    <div className='input'>
                        <input
                            name="email"
                            type="text"
                            placeholder="E-mail"
                            value={email}
                            onChange={handleInputChange}
                            className={emailEmptyError ? "errorInput" : ""}
                        ></input>
                    </div>

                    {/* password */}
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
                            onClick={() => setShowPassword(prev => !prev)}
                        >
        {showPassword ? renderIcon(EyeOff) : renderIcon(EyeOn)}
    </span>
                    </div>

                    {/* password repeat */}
                    <label className='inputTitle'>Powtórz hasło</label>

                    <div className='input passwordBox'>
                        <input
                            name="passwordRepeat"
                            type={showRepeatPassword ? "text" : "password"}
                            placeholder="Powtórz hasło"
                            value={passwordRepeat}
                            onChange={handleInputChange}
                            className={passwordRepeatEmptyError ? "errorInput" : ""}
                        />

                        <span
                            className="toggleIcon"
                            onClick={() => setShowRepeatPassword(prev => !prev)}
                        >
        {showRepeatPassword ? renderIcon(EyeOff) : renderIcon(EyeOn)}
    </span>
                    </div>


                </div>

                <div className='buttons'>
                    <button onClick={handleCreateAccount} className='signupBtn'>Utwórz konto</button>
                    <button onClick={handleBack} className='signupBtn'>Wróć</button>
                </div>
            </div>
        </Box>
    );
};

export default CreateNewAccountPage;