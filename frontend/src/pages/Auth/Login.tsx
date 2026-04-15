import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

import logo from '@assets/logo.png';
import PersonFill from '@assets/PersonFillPurple.svg';
import {Box} from "@mui/material";

const Login = () => {

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/");
    };

    const handleCreateAccount = () => {
        // navigate("/"); // todo
    };

    return (


        <div className='container'>

            <Box
                component="img"
                src={logo}
                alt="Parking+ Logo"
                sx={{
                    position: "absolute",
                    top: 20,
                    left: 20,

                    width: '100%',
                    maxWidth: 150,
                    height: 'auto',
                    objectFit: 'contain',
                }}
            />

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
                {/*login*/}
                <label className='inputTitle'>Login</label>
                <div className='input'>
                    <input type="text" placeholder="E-mail"></input>
                </div>

                {/*password*/}
                <label className='inputTitle'>Hasło</label>
                <div className='input'>
                    <input type="password" placeholder="Hasło"></input>
                </div>
                {/*<label className='forgotPasswordText'>Nie pamiętam hasła</label>*/}
                <a href="/forgot-password" className="forgotPasswordText">
                    Nie pamiętam hasła
                </a>



            </div>

            <div className='buttons'>
                <button onClick={handleLogin}  className='loginBtn'>Zaloguj się</button>
                <button onClick={handleCreateAccount} className='signupBtn'>Utwórz konto</button>
            </div>
        </div>
    );
};

export default Login;