import {Box, Paper} from '@mui/material';
import {Outlet, useLocation} from 'react-router-dom';
import Sidebar from '@components/Sidebar/Sidebar.tsx';
import StatisticsNavbar from '@components/Navbar/StatisticsNavbar.tsx';
import DashboardNavbar from '@components/Navbar/DashboardNavbar.tsx';
import ClientsNavbar from '@components/Navbar/ClientsNavbar.tsx';
import DefaultNavbar from '@components/Navbar/DefaultNavbar.tsx';
import EventsNavbar from '@components/Navbar/EventsNavbar.tsx';
import PricingNavbar from '@components/Navbar/PricingNavbar.tsx';
import SettingsNavbar from '@components/Navbar/SettingsNavbar.tsx';

const PagesLayout = () => {
    const location = useLocation();
    const isDashboard = location.pathname === '/' || location.pathname.startsWith('/dashboard');

    const navbarByRoutePrefix = [
        {prefix: '/statistics', navbar: <StatisticsNavbar/>},
        {prefix: '/clients', navbar: <ClientsNavbar/>},
        {prefix: '/events', navbar: <EventsNavbar/>},
        {prefix: '/pricing', navbar: <PricingNavbar/>},
        {prefix: '/settings', navbar: <SettingsNavbar/>},
        {prefix: '/dashboard', navbar: <DashboardNavbar/>},
        {prefix: '/', navbar: <DashboardNavbar/>},
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
                p: 1.5,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    width: '100%',
                    height: 'calc(100vh - 24px)',
                    minHeight: 'calc(100vh - 24px)',
                    overflow: 'hidden',
                }}
            >
                <Sidebar/>

                <Box
                    sx={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        overflow: 'hidden',
                    }}
                >
                    {currentNavbar}

                    {isDashboard ? (
                        <Box
                            sx={{
                                flex: 1,
                                minHeight: 0,
                                minWidth: 0,
                                display: 'flex',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                px: 3,
                                pb: 0,
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    minHeight: '100%',
                                    minWidth: 0,
                                    display: 'flex',
                                }}
                            >
                                <Outlet/>
                            </Box>
                        </Box>
                    ) : (
                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                minHeight: 0,
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                                overflow: 'hidden',
                                display: 'flex',
                                ml: 3,
                                mr: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    overflowY: 'auto',
                                    overflowX: 'hidden',
                                    p: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: '100%',
                                        minHeight: '100%',
                                        minWidth: 0,
                                    }}
                                >
                                    <Outlet/>
                                </Box>
                            </Box>
                        </Paper>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default PagesLayout;