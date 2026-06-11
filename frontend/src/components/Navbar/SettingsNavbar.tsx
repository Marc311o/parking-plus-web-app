import { Box } from '@mui/material';
import ClockCard from '../NavbarCard/ClockCard.tsx';
import UserCard from '../NavbarCard/UserCard.tsx';

const SettingsNavbar = () => {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '3fr 1.2fr',
                gap: 2,
                px: 3,
                alignItems: 'center',
            }}
        >
            <ClockCard />
            <UserCard />
        </Box>
    );
};

export default SettingsNavbar;