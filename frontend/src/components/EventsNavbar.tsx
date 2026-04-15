import { Box } from '@mui/material';
import EventsFilterCard from './EventsFilterCard';
import ClockCard from './ClockCard';
import UserCard from './UserCard';

const EventsNavbar = () => {
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                gap: 2,
                px: 3,
                alignItems: 'center',
            }}
        >
            <EventsFilterCard />
            <ClockCard />
            <UserCard />
        </Box>
    );
};

export default EventsNavbar;