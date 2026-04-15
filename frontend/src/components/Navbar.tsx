import {Box} from '@mui/material';
import StatisticsCards from './StatisticsCards';
import ClockCard from './ClockCard';
import UserCard from './UserCard';

const Navbar = () => {
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

export default Navbar;