import React, {useState} from "react";
import "./Login.css";
import {useNavigate} from "react-router-dom";
import QuestionMark from '@assets/questionMark.svg';
import EyeOn from '@assets/eyeOn.svg';
import EyeOff from '@assets/eyeOff.svg';
import {Box} from "@mui/material";


const ForgotPasswordPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/login");
    };

    const handleResetPassword = () => {
        // todo
    };


    const renderIcon = (icon: string | undefined) => {
        return <img src={icon} alt="icon" style={{width: 20, height: 20}}/>;
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

                {/* email */}
                <label className='inputTitle'>E-mail</label>
                <div className='input'>
                    <input type="text" placeholder="E-mail"/>
                </div>

                {/* password */}
                <label className='inputTitle'>Nowe hasło</label>

                <div className='input passwordBox'>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nowe hasło"
                    />

                    <span
                        className="toggleIcon"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? renderIcon(EyeOff) : renderIcon(EyeOn)}
                    </span>
                </div>

                {/* repeat password */}
                <label className='inputTitle'>Powtórz nowe hasło</label>

                <div className='input passwordBox'>
                    <input
                        type={showRepeatPassword ? "text" : "password"}
                        placeholder="Powtórz nowe hasło"
                    />

                    <span
                        className="toggleIcon"
                        onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    >
                        {showRepeatPassword ? renderIcon(EyeOff) : renderIcon(EyeOn)}
                    </span>
                </div>

            </div>

            <div className='buttons'>
                <button onClick={handleResetPassword} className='signupBtn'>
                    Resetuj hasło
                </button>
                <button onClick={handleBack} className='signupBtn'>
                    Wróć
                </button>
            </div>

        </div>
    );
};

export default ForgotPasswordPage;