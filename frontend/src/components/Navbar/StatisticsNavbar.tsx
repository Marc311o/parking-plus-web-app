import {Box} from '@mui/material';
import StatisticsCards from '../NavbarCard/StatisticsCards.tsx';
import ClockCard from '../NavbarCard/ClockCard.tsx';
import UserCard from '../NavbarCard/UserCard.tsx';

const StatisticsNavbar = () => {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                gap: 2,
                flexShrink: 0,
                alignItems: 'center',
                px: 3,
            }}
        >
            <StatisticsCards/>
            <ClockCard/>
            <UserCard/>
        </Box>
    );
};

export default StatisticsNavbar;