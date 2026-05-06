import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import { useIntl } from "react-intl";
import PersonFill from '@assets/PersonFillPurple.svg';
import {Alert, Box, Stack, Typography} from "@mui/material";
import AuthPasswordField from "@components/Login/AuthPasswordField.tsx";
import AuthDefaultField from "@components/Login/AuthDefaultField.tsx";
import ButtonWhite from "@components/Login/ButtonWhite.tsx";
import { createNewAccount } from "@api/Login/auth";


const CreateNewAccountPage = () => {
    const {formatMessage} = useIntl();

    const navigate = useNavigate();

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);
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


    const handleBack = () => {
        navigate("/login");
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

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
                throw new Error(formatMessage({ id: 'logins.errors.auth.emptyFields' }));
            }

            if (!isValidEmail(email)) {
                throw new Error(formatMessage({ id: 'logins.errors.auth.invalidEmail' }));
            }

            if (password.length < 6) {
                throw new Error(formatMessage({ id: 'logins.errors.auth.passwordTooShort' }))
            }

            if (password !== passwordRepeat) {
                throw new Error(formatMessage({ id: 'logins.errors.auth.passwordsNotMatch' }))
            }

            await createNewAccount(name, surname, email, password);

            navigate("/login");

        } catch (err) {
            if (err instanceof Error) {
                setError(formatMessage({ id: err.message }));
            } else {
                setError(formatMessage({ id: 'logins.errors.auth.unknown' }));
            }
        } finally {
            setLoading(false);
        }

    };


    return (

        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
            }}
        >

            <Box component="form" onSubmit={handleCreateAccount}
                 sx={{
                     display: "flex",
                     flexDirection: "column",
                     alignItems: "center",
                 }}
            >
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
                        {formatMessage({ id: 'logins.createNewAccount.title' })}
                    </Typography>

                    <Box
                        component="img"
                        src={PersonFill}
                        alt="Person Fill"
                        sx={{width: '100%', maxWidth: 150, mt: 5,}}
                    />

                    <Stack
                        spacing={2}
                        sx={{
                            mt: "55px",
                            alignItems: "flex-start",
                            width: 350,
                        }}
                    >

                        {error && <Alert severity="error">{error}</Alert>}

                        {/*name*/}
                        <AuthDefaultField
                            name={"name"}
                            label={formatMessage({ id: 'logins.createNewAccount.firstNameLabel' })}
                            placeholder={formatMessage({ id: 'logins.createNewAccount.firstNamePlaceholder' })}
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement, Element>) => handleInputChange(e)}
                            disabled={loading}
                            error={nameEmptyError}
                        />

                        {/*surname*/}
                        <AuthDefaultField
                            name={"surname"}
                            label={formatMessage({ id: 'logins.createNewAccount.lastNameLabel' })}
                            placeholder={formatMessage({ id: 'logins.createNewAccount.lastNamePlaceholder' })}
                            value={surname}
                            onChange={(e: React.ChangeEvent<HTMLInputElement, Element>) => handleInputChange(e)}
                            disabled={loading}
                            error={surnameEmptyError}
                        />

                        {/*mail*/}
                        <AuthDefaultField
                            name={"email"}
                            label={formatMessage({ id: 'logins.createNewAccount.emailLabel' })}
                            placeholder={formatMessage({ id: 'logins.createNewAccount.emailPlaceholder' })}
                            value={email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement, Element>) => handleInputChange(e)}
                            disabled={loading}
                            error={emailEmptyError}
                        />

                        {/* password */}
                        <AuthPasswordField
                            name="password"
                            label={formatMessage({ id: 'logins.createNewAccount.passwordLabel' })}
                            placeholder={formatMessage({ id: 'logins.createNewAccount.passwordPlaceholder' })}
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement, Element>) => handleInputChange(e)}
                            disabled={loading}
                            error={passwordEmptyError}
                        />

                        {/* password repeat */}
                        <AuthPasswordField
                            name="passwordRepeat"
                            label={formatMessage({ id: 'logins.createNewAccount.confirmPasswordLabel' })}
                            placeholder={formatMessage({ id: 'logins.createNewAccount.confirmPasswordPlaceholder' })}
                            value={passwordRepeat}
                            onChange={(e: React.ChangeEvent<HTMLInputElement, Element>) => handleInputChange(e)}
                            disabled={loading}
                            error={passwordRepeatEmptyError}
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

                        <ButtonWhite type="submit" onClick={handleCreateAccount}>
                            {formatMessage({ id: 'logins.createNewAccount.createButton' })}
                        </ButtonWhite>

                        <ButtonWhite type="button" onClick={handleBack}>
                            {formatMessage({ id: 'logins.createNewAccount.backButton' })}
                        </ButtonWhite>

                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default CreateNewAccountPage;