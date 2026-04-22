import React, {useState} from "react";
import "./Login.css";
import {useNavigate} from "react-router-dom";
import renderIcon from "../../utils/RenderIcon";

import PersonFill from '@assets/PersonFillPurple.svg';
import {Box} from "@mui/material";
import EyeOn from '@assets/eyeOn.svg';
import EyeOff from '@assets/eyeOff.svg';



const CreateNewAccountPage = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);


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

                    {/* password */}
                    <label className='inputTitle'>Hasło</label>

                    <div className='input passwordBox'>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Hasło"
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
                            type={showRepeatPassword ? "text" : "password"}
                            placeholder="Powtórz hasło"
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