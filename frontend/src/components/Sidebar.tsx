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
import {useIntl} from 'react-intl';
import logo from '@assets/logo.png';

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

    const menuItems = [
        {
            text: formatMessage({id: 'sidebar.menu.dashboard'}),
            icon: <DashboardIcon/>,
        },
        {
            text: formatMessage({id: 'sidebar.menu.statistics'}),
            icon: <BarChartIcon/>,
            active: true,
        },
        {
            text: formatMessage({id: 'sidebar.menu.clients'}),
            icon: <PeopleIconOutlined/>,
        },
        {
            text: formatMessage({id: 'sidebar.menu.events'}),
            icon: <EventIcon/>,
        },
    ];

    const secondaryItems = [
        {
            text: formatMessage({id: 'sidebar.other.settings'}),
            icon: <SettingsIcon/>,
        },
        {
            text: formatMessage({id: 'sidebar.other.logout'}),
            icon: <LogoutIcon/>,
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
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{mb: 0.5}}>
                        <ListItemButton
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
                    <ListItem key={item.text} disablePadding sx={{mb: 0.5}}>
                        <ListItemButton
                            sx={{
                                minHeight: 44,
                                borderRadius: 2.5,
                                color: 'text.secondary',
                                '& .MuiListItemIcon-root': {
                                    minWidth: 34,
                                    color: 'text.secondary',
                                },
                                '& .MuiTypography-root': {
                                    fontWeight: 500,
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