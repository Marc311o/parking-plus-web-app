import {Box} from '@mui/material';
import ClientsFilterCard from '../NavbarCard/ClientsFilterCard.tsx';
import ClockCard from '../NavbarCard/ClockCard.tsx';
import UserCard from '../NavbarCard/UserCard.tsx';

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