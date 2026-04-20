import React from "react";
import "./Login.css";
import {useNavigate} from "react-router-dom";

import PersonFill from '@assets/PersonFillPurple.svg';
import {Box} from "@mui/material";

const CreateNewAccountPage = () => {

    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/login");
    };

    const handleCreateAccount = () => {
        // todo
    };

    return (

        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
            }}
        >

            <div className='container'>


                <h1>ZAŁÓŹ KONTO</h1>

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
                    {/*name*/}
                    <label className='inputTitle'>Imię</label>
                    <div className='input'>
                        <input type="text" placeholder="Imię"></input>
                    </div>

                    {/*surname*/}
                    <label className='inputTitle'>Nazwisko</label>
                    <div className='input'>
                        <input type="text" placeholder="Nazwisko"></input>
                    </div>

                    {/*mail*/}
                    <label className='inputTitle'>Login</label>
                    <div className='input'>
                        <input type="text" placeholder="E-mail"></input>
                    </div>

                    {/*password*/}
                    <label className='inputTitle'>Hasło</label>
                    <div className='input'>
                        <input type="password" placeholder="Hasło"></input>
                    </div>

                    {/*password repeat*/}
                    <label className='inputTitle'>Powtórz hasło</label>
                    <div className='input'>
                        <input type="password" placeholder="Powtórz hasło"></input>
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