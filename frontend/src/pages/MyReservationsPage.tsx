import {Box} from '@mui/material';
import ListView, {type ListViewColumn} from '@components/Common/ListView';
import {useAuthStore} from '@store/useAuthStore';



const MyReservationsPage = () => {

    return (
        <Box sx={{width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5}}>

            <h1>My reservations</h1>

        </Box>
    );
};

export default MyReservationsPage;