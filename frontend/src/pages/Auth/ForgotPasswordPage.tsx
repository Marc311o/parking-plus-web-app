import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

import QuestionMark from '@assets/questionMark.svg';
import {Box} from "@mui/material";

const ForgotPasswordPage = () => {


    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/login");
    };

    const handleResetPassword = () => {
        // todo
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

                <h3>Wprowadź adres e-mail przypisany do Twojego konta. Na ten adres zostanie wysłany link umożliwiający zresetowanie hasła.</h3>


                {/*mail*/}
                <label className='inputTitle'>E-mail</label>
                <div className='input'>
                    <input type="text" placeholder="E-mail"></input>
                </div>

                {/*password*/}
                <label className='inputTitle'>Nowe hasło</label>
                <div className='input'>
                    <input type="password" placeholder="Nowe hasło"></input>
                </div>

                {/*password repeat*/}
                <label className='inputTitle'>Powtórz nowe hasło</label>
                <div className='input'>
                    <input type="password" placeholder="Powtórz nowe hasło"></input>
                </div>

            </div>

            <div className='buttons'>
                <button onClick = {handleResetPassword} className='signupBtn'>Resetuj hasło</button>
                <button onClick = {handleBack} className='signupBtn'>Wróć</button>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;