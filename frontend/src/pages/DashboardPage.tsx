import {Box} from '@mui/material';
import {ParkingMap} from '../components/Parking';

const DashboardPage = () => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                minHeight: 640,
                display: 'flex',
            }}
        >
            <ParkingMap/>
        </Box>
    );
};

export default DashboardPage;