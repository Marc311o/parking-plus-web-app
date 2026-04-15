import {Box} from '@mui/material';
import OccupancyCard from '../NavbarCard/OccupancyCard.tsx';
import RevenueCard from '../NavbarCard/RevenueCard.tsx';
import ClockCard from '../NavbarCard/ClockCard.tsx';
import UserCard from '../NavbarCard/UserCard.tsx';

const DashboardNavbar = () => {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1.2fr',
                gap: 2,
                flexShrink: 0,
                px: 3,
                alignItems: 'center',
            }}
        >
            <OccupancyCard/>
            <RevenueCard/>
            <ClockCard/>
            <UserCard/>
        </Box>
    );
};

export default DashboardNavbar;