import { Box } from '@mui/material';
import EventsFilterCard from '../NavbarCard/EventsFilterCard.tsx';
import ClockCard from '../NavbarCard/ClockCard.tsx';
import UserCard from '../NavbarCard/UserCard.tsx';

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