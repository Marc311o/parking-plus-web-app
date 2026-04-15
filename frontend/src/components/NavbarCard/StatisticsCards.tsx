import {Box, Typography, Paper} from '@mui/material';
import {useIntl} from 'react-intl';
import {useLocation, useNavigate} from 'react-router-dom';
import pPurpleIcon from '@assets/Ppurple.svg';
import pGreyIcon from '@assets/Pgrey.svg';
import parkingSpacesPurpleIcon from '@assets/parkingSpacesIconpurple.svg';
import parkingSpacesGreyIcon from '@assets/parkingSpacesIcongrey.svg';

const StatisticsCards = () => {
    const {formatMessage} = useIntl();
    const location = useLocation();
    const navigate = useNavigate();

    const isParkingActive = location.pathname === '/statistics/parking';
    const isPlacesActive = location.pathname === '/statistics/places';

    return (
        <Paper
            elevation={0}
            sx={{
                height: 130,
                borderRadius: 1,
                display: 'flex',
                overflow: 'hidden',
                bgcolor: '#f3f3f3',
            }}
        >
            <Box
                onClick={() => navigate('/statistics/parking')}
                sx={{
                    width: '50%',
                    px: '28px',
                    py: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isParkingActive
                        ? 'linear-gradient(180deg, #F4EDF6 0%, #C55AD7 100%)'
                        : '#f3f3f3',
                }}
            >
                <Typography
                    sx={{
                        color: isParkingActive ? '#5E076E' : '#B7B7B7',
                        fontSize: '25px',
                        fontWeight: 600,
                        lineHeight: 1.05,
                        whiteSpace: 'pre-line',
                        letterSpacing: 0,
                    }}
                >
                    {formatMessage({id: 'navbar.statisticsCards.parking'})}
                </Typography>

                <Box
                    component="img"
                    src={isParkingActive ? pPurpleIcon : pGreyIcon}
                    alt={formatMessage({id: 'navbar.statisticsCards.parking'})}
                    sx={{
                        width: 50,
                        height: 50,
                        objectFit: 'contain',
                        flexShrink: 0,
                    }}
                />
            </Box>

            <Box
                onClick={() => navigate('/statistics/places')}
                sx={{
                    width: '50%',
                    px: '28px',
                    py: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isPlacesActive
                        ? 'linear-gradient(180deg, #F4EDF6 0%, #C55AD7 100%)'
                        : '#f3f3f3',
                }}
            >
                <Typography
                    sx={{
                        color: isPlacesActive ? '#5E076E' : '#B7B7B7',
                        fontSize: '25px',
                        fontWeight: 600,
                        lineHeight: 1.05,
                        whiteSpace: 'pre-line',
                        letterSpacing: 0,
                    }}
                >
                    {formatMessage({id: 'navbar.statisticsCards.places'})}
                </Typography>

                <Box
                    component="img"
                    src={isPlacesActive ? parkingSpacesPurpleIcon : parkingSpacesGreyIcon}
                    alt={formatMessage({id: 'navbar.statisticsCards.places'})}
                    sx={{
                        width: 50,
                        height: 50,
                        objectFit: 'contain',
                        flexShrink: 0,
                    }}
                />
            </Box>
        </Paper>
    );
};

export default StatisticsCards;