import {createTheme} from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#5E076E',
            light: '#8B1F9E',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#8B1F9E',
        },
        background: {
            default: '#5E076E',
            paper: '#f3f3f5',
        },
        text: {
            primary: '#2b2b2b',
            secondary: '#9b9b9f',
        },
        divider: '#e5e5ea',
    },
    typography: {
        fontFamily: `"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif`,
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
        },
        body2: {
            fontSize: '0.95rem',
        },
        caption: {
            fontSize: '0.75rem',
        },
    },
    shape: {
        borderRadius: 20,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    width: '100%',
                    height: '100%',
                },
                body: {
                    width: '100%',
                    height: '100%',
                    margin: 0,
                    overflow: 'hidden',
                },
                '#root': {
                    width: '100%',
                    height: '100%',
                },
                '*': {
                    boxSizing: 'border-box',
                },
                '*::-webkit-scrollbar': {
                    width: 10,
                    height: 10,
                },
                '*::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(94, 7, 110, 0.28)',
                    borderRadius: 999,
                },
                '*::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});

export default theme;