import {Box, Paper} from '@mui/material';
import {Outlet, useLocation} from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StatisticsNavbar from '../components/StatisticsNavbar';
import DashboardNavbar from '../components/DashboardNavbar';
import ClientsNavbar from '../components/ClientsNavbar';
import DefaultNavbar from '../components/DefaultNavbar';
import EventsNavbar from '../components/EventsNavbar';
import PricingNavbar from '../components/PricingNavbar';
import SettingsNavbar from '../components/PricingNavbar';

const PagesLayout = () => {
    const location = useLocation();

    const navbarByRoutePrefix = [
        {
            prefix: '/statistics',
            navbar: <StatisticsNavbar/>,
        },
        {
            prefix: '/clients',
            navbar: <ClientsNavbar/>,
        },
        {
            prefix: '/events',
            navbar: <EventsNavbar/>,
        },
        {
            prefix: '/pricing',
            navbar: <PricingNavbar/>,
        },
        {
            prefix: '/settings',
            navbar: <SettingsNavbar/>,
        },
        {
            prefix: '/dashboard',
            navbar: <DashboardNavbar/>,
        },
        {
            prefix: '/',
            navbar: <DashboardNavbar/>,
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
                </Box>
            </Box>
        </Box>
    );
};

export default PagesLayout;