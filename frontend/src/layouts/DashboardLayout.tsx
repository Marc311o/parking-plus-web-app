import {Box, Paper} from '@mui/material';
import {Outlet} from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
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
                    <Navbar/>

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

export default DashboardLayout;