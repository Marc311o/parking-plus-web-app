import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

import PersonFill from '@assets/PersonFillPurple.svg';
import {Box} from "@mui/material";

const ForgotPasswordPage = () => {


    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/login");
    };

    const handleCreateAccount = () => {
        // todo
    };

    return (

        <div className='container'>

            <h1>RESET HASŁA</h1>

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


                {/*mail*/}
                <label className='inputTitle'>Login</label>
                <div className='input'>
                    <input type="text" placeholder="E-mail"></input>
                </div>

            </div>

            <div className='buttons'>
                <button onClick = {handleCreateAccount} className='signupBtn'>Utwórz konto</button>
                <button onClick = {handleBack} className='signupBtn'>Wróć</button>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;