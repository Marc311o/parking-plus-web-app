import {Box, Paper, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import {ParkingMap} from '@components/Parking';

const ParkingSpacesStatisticsPage = () => {
    const {formatMessage} = useIntl();

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                minHeight: 640,
                display: 'flex',
            }}
        >
            <ParkingMap
                variant="statistics"
                interactive={false}
                showDetailsPanel={false}
            />
        </Box>
    );
};

export default ParkingSpacesStatisticsPage;