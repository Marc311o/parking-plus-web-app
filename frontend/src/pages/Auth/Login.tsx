import React from "react";
import "./Login.css";
import {useNavigate} from "react-router-dom";

import PersonFill from '@assets/PersonFillPurple.svg';
import {Box} from "@mui/material";

const Login = () => {

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/");
    };

    const handleCreateAccount = () => {
        navigate("/createnewaccount");
    };

    return (

        <Box
            sx={{
                width: '100%',
                minHeight: '100%',
            }}
        >

            <div className='container'>

                <h1>ZALOGUJ SIĘ</h1>

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
                    <a href="/forgotpassword" className="forgotPasswordText">
                        Nie pamiętam hasła
                    </a>


                </div>

                <div className='buttons'>
                    <button onClick={handleLogin} className='loginBtn'>Zaloguj się</button>
                    <button onClick={handleCreateAccount} className='signupBtn'>Utwórz konto</button>
                </div>
            </div>
        </Box>
    );
};

export default Login;