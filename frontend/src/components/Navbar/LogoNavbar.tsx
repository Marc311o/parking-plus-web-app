import React from "react";
import { Box } from "@mui/material";
import logo from "@assets/logo.png";

const LogoNavbar = () => {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                alignItems: 'center',
                px: 3,
                py: 1,
                position: 'sticky',
                top: 0,
                left: 0,
                width: '100%',
                backgroundColor: 'white',
                zIndex: 1000,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
        >
            <Box
                component="img"
                src={logo}
                alt="Parking+ Logo"
                sx={{
                    width: "auto",
                    height: 70,
                    objectFit: "contain",
                }}
            />
        </Box>
    );
};

export default LogoNavbar;