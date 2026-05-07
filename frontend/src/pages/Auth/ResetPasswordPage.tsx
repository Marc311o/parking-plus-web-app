import React, {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import { useIntl } from "react-intl";
import {Alert, Box, Stack, Typography} from "@mui/material";
import AuthPasswordField from "@components/Login/AuthPasswordField.tsx";
import ButtonWhite from "@components/Login/ButtonWhite.tsx";
import { resetPassword  } from "@api/Login/auth";
import QuestionMark from '@assets/questionMark.svg';


const ResetPasswordPage = () => {
    const {formatMessage} = useIntl();

    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

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

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError(formatMessage({ id: 'logins.errors.auth.missingToken' }));
            return;
        }

        if (!password || !passwordRepeat) {
            setError(formatMessage({ id: 'logins.errors.auth.emptyFields' }));
            if (!password)
                setPasswordEmptyError(true)
            if (!passwordRepeat)
                setPasswordRepeatEmptyError(true)
            return;
        }

        if (password.length < 6) {
            setError(formatMessage({ id: 'logins.errors.auth.passwordTooShort' }));
            return;
        }

        if (password !== passwordRepeat) {
            setError(formatMessage({ id: 'logins.errors.auth.passwordsNotMatch' }));
            return;
        }


        try {
            setLoading(true);

            await resetPassword(token, password);

            alert(formatMessage({ id: 'logins.errors.resetPassword.success' }));
            navigate("/login");

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(formatMessage({ id: 'logins.errors.auth.unknown' }));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

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
        <Box sx={{width: '100%', minHeight: '100vh'}}>
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
                    {formatMessage({ id: 'logins.resetPassword.title' })}
                </Typography>

                <Box
                    component="img"
                    src={QuestionMark}
                    alt="Question Mark"
                    sx={{width: '100%', maxWidth: 150, mt: 5,}}
                />

                <Box component="form" onSubmit={handleResetPassword}
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

                        {error && (
                            <Alert severity="error" sx={{ width: "100%" }}>
                                {error}
                            </Alert>
                        )}

                        {/* password */}
                        <AuthPasswordField
                            name="password"
                            label={formatMessage({ id: "logins.resetPassword.passwordLabel" })}
                            placeholder={formatMessage({ id: "logins.resetPassword.passwordPlaceholder" })}
                            value={password}
                            onChange={(e) => handleInputChange(e)}
                            disabled={loading}
                            error={passwordEmptyError}
                        />

                        {/* password repeat */}
                        <AuthPasswordField
                            name="passwordRepeat"
                            label={formatMessage({ id: "logins.resetPassword.confirmPasswordLabel" })}
                            placeholder={formatMessage({ id: "logins.resetPassword.confirmPasswordPlaceholder" })}
                            value={passwordRepeat}
                            onChange={(e) => handleInputChange(e)}
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

                        <ButtonWhite type="submit">
                            {loading ? formatMessage({ id: "logins.resetPassword.resetButton" }) : formatMessage({ id: "logins.resetPassword.verifyButton" })}
                        </ButtonWhite>

                        <ButtonWhite type="button" onClick={handleBack}>
                            {formatMessage({ id: "logins.resetPassword.backButton" })}
                        </ButtonWhite>

                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default ResetPasswordPage;