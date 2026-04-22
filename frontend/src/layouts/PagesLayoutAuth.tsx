import {Box, Paper} from '@mui/material';
import {Outlet, useLocation} from 'react-router-dom';
import DefaultNavbar from '../components/Navbar/DefaultNavbar.tsx';
import LogoNavbar from '../components/Navbar/LogoNavbar.tsx';

const PagesLayoutAuth = () => {
    const location = useLocation();

    const navbarByRoutePrefix = [
        {
            prefix: '/createnewaccount',
            navbar: <LogoNavbar/>,
        },
        {
            prefix: '/login',
            navbar: <LogoNavbar/>,
        },
        {
            prefix: '/forgotpassword',
            navbar: <LogoNavbar/>,
        },
    ];

    const currentNavbar =
        navbarByRoutePrefix.find(({prefix}) =>
            prefix === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(prefix)
        )?.navbar ?? <DefaultNavbar/>;

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #5E076E 0%, #8B1F9E 100%)',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {currentNavbar}

                <Paper
                    elevation={0}
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        bgcolor: 'background.paper',
                        borderRadius: 0,
                        display: 'flex',
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                width: '100%',
                                minHeight: '100%',
                            }}
                        >
                            <Outlet />
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default PagesLayoutAuth;