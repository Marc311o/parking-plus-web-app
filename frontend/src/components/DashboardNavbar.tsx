import {Box} from '@mui/material';
import OccupancyCard from './OccupancyCard';
import RevenueCard from './RevenueCard';
import ClockCard from './ClockCard';
import UserCard from './UserCard';

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