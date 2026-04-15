import {Box, Typography, Paper} from '@mui/material';
import {useIntl} from 'react-intl';
import pIcon from '@assets/P.svg';
import parkingSpacesIcon from '@assets/parkingSpacesIcon.svg';

const StatisticsCards = () => {
    const {formatMessage} = useIntl();

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
                sx={{
                    width: '50%',
                    px: '28px',
                    py: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(180deg, #F4EDF6 0%, #C55AD7 100%)',
                }}
            >
                <Typography
                    sx={{
                        color: '#5E076E',
                        fontSize: '18px',
                        fontWeight: 400,
                        lineHeight: 1.05,
                        whiteSpace: 'pre-line',
                        letterSpacing: 0,
                    }}
                >
                    {formatMessage({id: 'navbar.statisticsCards.parking'})}
                </Typography>

                <Box
                    component="img"
                    src={pIcon}
                    alt={formatMessage({id: 'navbar.statisticsCards.parking'})}
                    sx={{
                        width: 43,
                        height: 43,
                        objectFit: 'contain',
                        flexShrink: 0,
                    }}
                />
            </Box>

            <Box
                sx={{
                    width: '50%',
                    px: '28px',
                    py: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    bgcolor: '#f3f3f3',
                }}
            >
                <Typography
                    sx={{
                        color: '#B7B7B7',
                        fontSize: '18px',
                        fontWeight: 400,
                        lineHeight: 1.05,
                        whiteSpace: 'pre-line',
                        letterSpacing: 0,
                    }}
                >
                    {formatMessage({id: 'navbar.statisticsCards.places'})}
                </Typography>

                <Box
                    component="img"
                    src={parkingSpacesIcon}
                    alt={formatMessage({id: 'navbar.statisticsCards.places'})}
                    sx={{
                        width: 38,
                        height: 38,
                        objectFit: 'contain',
                        flexShrink: 0,
                        opacity: 0.65,
                    }}
                />
            </Box>
        </Paper>
    );
};

export default StatisticsCards;