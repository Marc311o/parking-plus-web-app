import {Box} from '@mui/material';
import ClientsFilterCard from './ClientsFilterCard';
import ClockCard from './ClockCard';
import UserCard from './UserCard';

const ClientsNavbar = () => {
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
            <ClientsFilterCard/>
            <ClockCard/>
            <UserCard/>
        </Box>
    );
};

export default ClientsNavbar;