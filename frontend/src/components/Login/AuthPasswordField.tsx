import { TextField, Box, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';

type Props = {
    name: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    error?: boolean;
};

export function AuthPasswordField({
                                      name,
                                      label,
                                      placeholder,
                                      value,
                                      onChange,
                                      disabled,
                                      error = false,
                                  }: Props) {

    const [showPassword, setShowPassword] = useState(false);

    return (
        <Box sx={{ width: 350, mb: 1.5 }}>

            <Box
                sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: error ? "red" : "#5E076E",
                    mb: 0.5,
                }}
            >
                {label}
            </Box>

            <TextField
                name={name}
                error={error}
                placeholder={placeholder}
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={onChange}
                disabled={disabled}
                fullWidth
                required

                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    edge="end"
                                    tabIndex={-1}
                                    sx={{
                                        padding: 0.25,
                                        marginRight: -0.5,
                                        maxWidth: 20,
                                        maxHeight: 20
                                    }}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}

                sx={{
                    "& .MuiOutlinedInput-root": {
                        height: 40,
                        borderRadius: "10px",

                        "& fieldset": {
                            borderColor: error ? "red" : "#5E076E",
                            borderWidth: 2,
                            boxShadow: error ? "0 0 5px red" : "none",
                        },

                        "&:hover fieldset": {
                            borderColor: error ? "red" : "#5E076E",
                            borderWidth: 3,
                            boxShadow: error ? "0 0 5px red" : "none",
                        },

                        "&.Mui-focused fieldset": {
                            borderColor: error ? "red" : "#5E076E",
                            boxShadow: error ? "0 0 5px red" : "none",
                        },
                    },

                    "& .MuiInputBase-input": {
                        padding: "0 10px",
                        fontSize: "15px",
                    },
                }}
            />
        </Box>
    );
}

export default AuthPasswordField;