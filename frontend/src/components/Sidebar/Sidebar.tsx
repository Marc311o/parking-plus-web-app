import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIconOutlined from '@mui/icons-material/PeopleOutlined';
import EventIcon from '@mui/icons-material/Event';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import {useIntl} from 'react-intl';
import {useLocation, useNavigate} from 'react-router-dom';
import logo from '@assets/logo.png';
import {useAuthStore} from "../../store/useAuthStore.tsx";

const SidebarContainer = styled(Box)(({theme}) => ({
    width: 300,
    minWidth: 300,
    height: '100%',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 20,
    padding: theme.spacing(2.5, 2),
    display: 'flex',
    flexDirection: 'column',
}));

const Sidebar = () => {
    const {formatMessage} = useIntl();
    const location = useLocation();
    const navigate = useNavigate();

    const logout = useAuthStore((state) => state.logout);
    const handleLogout = () => {
        logout()
        navigate('/login');
    };

    const user = useAuthStore((state) => state.user);

    const isAdmin = user?.isOperator === true;
    const isClient = !isAdmin;

    const menuItems = [
        {
            text: formatMessage({id: 'sidebar.menu.dashboard'}),
            icon: <DashboardIcon/>,
            path: '/',
            active: location.pathname === '/dashboard',
            visibleFor: 'ADMIN',
        },
        {
            text: formatMessage({id: 'sidebar.menu.parkingPurchase'}),
            icon: <ShoppingCartOutlinedIcon/>,
            path: '/parkingPurchase',
            active: location.pathname === '/parkingPurchase',
            visibleFor: 'CLIENT',
        },
        {
            text: formatMessage({id: 'sidebar.menu.myCars'}),
            icon: <DirectionsCarRoundedIcon/>,
            path: '/myCars',
            active: location.pathname === '/myCars',
            visibleFor: 'CLIENT',
        },
        {
            text: formatMessage({id: 'sidebar.menu.myReservations'}),
            icon: <EventSeatIcon/>,
            path: '/myReservations',
            active: location.pathname === '/myReservations',
            visibleFor: 'CLIENT',
        },
        {
            text: formatMessage({id: 'sidebar.menu.statistics'}),
            icon: <BarChartIcon/>,
            path: '/statistics',
            active: location.pathname.startsWith('/statistics'),
            visibleFor: 'ADMIN',
        },
        {
            text: formatMessage({id: 'sidebar.menu.clients'}),
            icon: <PeopleIconOutlined/>,
            path: '/clients',
            active: location.pathname.startsWith('/clients'),
            visibleFor: 'ADMIN',
        },
        {
            text: formatMessage({id: 'sidebar.menu.events'}),
            icon: <EventIcon/>,
            path: '/events',
            active: location.pathname.startsWith('/events'),
            visibleFor: 'ADMIN',
        },
        {
            text: formatMessage({id: 'sidebar.menu.prices'}),
            icon: <LocalAtmIcon/>,
            path: '/pricing',
            active: location.pathname.startsWith('/pricing'),
            visibleFor: 'ALL',
        },
    ];

    const filteredMenuItems = menuItems.filter(item => {
        if (item.visibleFor === 'ALL') return true;
        if (item.visibleFor === 'ADMIN') return isAdmin;
        if (item.visibleFor === 'CLIENT') return isClient;
        return false;
    })

    const secondaryItems = [
        {
            text: formatMessage({id: 'sidebar.other.settings'}),
            icon: <SettingsIcon/>,
            path: '/settings',
            active: location.pathname.startsWith('/settings'),
            visibleFor: 'ALL',
        },
        {
            text: formatMessage({id: 'sidebar.other.logout'}),
            icon: <LogoutIcon/>,
            onClick: handleLogout,
            visibleFor: 'ALL',
        },
    ];

    return (
        <SidebarContainer>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 6,
                    pt: 4,
                }}
            >
                <Box
                    component="img"
                    src={logo}
                    alt="Parking+ Logo"
                    sx={{
                        width: '100%',
                        maxWidth: 150,
                        height: 'auto',
                        objectFit: 'contain',
                    }}
                />
            </Box>

            <Typography
                variant="caption"
                sx={{
                    color: 'text.secondary',
                    mb: 1.5,
                    ml: 1,
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                }}
            >
                {formatMessage({id: 'sidebar.sections.menu'})}
            </Typography>

            <List sx={{p: 0}}>
                {filteredMenuItems.map((item) => (
                    <ListItem key={item.path} disablePadding sx={{mb: 0.5}}>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            sx={{
                                minHeight: 44,
                                borderRadius: 2.5,
                                color: item.active ? 'primary.main' : 'text.secondary',
                                '& .MuiListItemIcon-root': {
                                    minWidth: 34,
                                    color: item.active ? 'primary.main' : 'text.secondary',
                                },
                                '& .MuiTypography-root': {
                                    fontWeight: item.active ? 700 : 500,
                                },
                                '&:hover': {
                                    bgcolor: 'rgba(94, 7, 110, 0.05)',
                                },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Box sx={{flexGrow: 1}}/>

            <Typography
                variant="caption"
                sx={{
                    color: 'text.secondary',
                    mb: 1.5,
                    ml: 1,
                    letterSpacing: 1.2,
                    textTransform: 'uppercase',
                }}
            >
                {formatMessage({id: 'sidebar.sections.other'})}
            </Typography>

            <List sx={{p: 0}}>
                {secondaryItems.map((item) => (
                    <ListItem key={item.path} disablePadding sx={{mb: 0.5}}>
                        <ListItemButton
                            onClick={() => {
                                if (item.onClick) {
                                    item.onClick();
                                } else {
                                    navigate(item.path);
                                }
                            }}
                            sx={{
                                minHeight: 44,
                                borderRadius: 2.5,
                                color: item.active ? 'primary.main' : 'text.secondary',
                                '& .MuiListItemIcon-root': {
                                    minWidth: 34,
                                    color: item.active ? 'primary.main' : 'text.secondary',
                                },
                                '& .MuiTypography-root': {
                                    fontWeight: item.active ? 700 : 500,
                                },
                                '&:hover': {
                                    bgcolor: 'rgba(94, 7, 110, 0.05)',
                                },
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </SidebarContainer>
    );
};

export default Sidebar;