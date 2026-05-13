import {
    TextField,
    Box,
} from '@mui/material';

type Props = {
    name: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    disabled?: boolean;
    error?: boolean;
    maxLength?: number;
};

export function AuthDefaultField({
                                     name,
                                     label,
                                     placeholder,
                                     value,
                                     onChange,
                                     disabled,
                                     maxLength,
                                     error = false,
                                 }: Props) {
    return (
        <Box sx={{width: 350, mb: 1.5}}>

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
                type={'text'}
                value={value}
                onChange={onChange}
                disabled={disabled}
                fullWidth
                required
                slotProps={{
                    htmlInput: {
                        maxLength: maxLength,
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

export default AuthDefaultField;