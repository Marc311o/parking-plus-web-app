import {Box, Typography, Paper} from '@mui/material';
import {useIntl} from 'react-intl';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

type PricingSwitcherProps = {
    view: 'hourly' | 'daily';
    onViewChange: (view: 'hourly' | 'daily') => void;
};

const PricingSwitcher = ({view, onViewChange}: PricingSwitcherProps) => {
    const {formatMessage} = useIntl();

    const isHourlyActive = view === 'hourly';
    const isDailyActive = view === 'daily';

    return (
        <Paper
            elevation={0}
            sx={{
                height: 130,
                borderRadius: 1,
                display: 'flex',
                overflow: 'hidden',
                bgcolor: '#f3f3f3',
                width: '100%',
            }}
        >
            <Box
                onClick={() => onViewChange('hourly')}
                sx={{
                    width: '50%',
                    px: '28px',
                    py: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isHourlyActive
                        ? 'linear-gradient(180deg, #F4EDF6 0%, #C55AD7 100%)'
                        : '#f3f3f3',
                    transition: '0.2s ease',
                }}
            >
                <Typography
                    sx={{
                        color: isHourlyActive ? '#5E076E' : '#B7B7B7',
                        fontSize: '25px',
                        fontWeight: 600,
                        lineHeight: 1.05,
                        whiteSpace: 'pre-line',
                        letterSpacing: 0,
                    }}
                >
                    {formatMessage({id: 'prices.switcher.hourly'})}
                </Typography>

                <AccessTimeFilledIcon
                    sx={{
                        fontSize: 50,
                        color: isHourlyActive ? '#8E24AA' : '#B7B7B7',
                    }}
                />
            </Box>

            <Box
                onClick={() => onViewChange('daily')}
                sx={{
                    width: '50%',
                    px: '28px',
                    py: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isDailyActive
                        ? 'linear-gradient(180deg, #F4EDF6 0%, #C55AD7 100%)'
                        : '#f3f3f3',
                    transition: '0.2s ease',
                }}
            >
                <Typography
                    sx={{
                        color: isDailyActive ? '#5E076E' : '#B7B7B7',
                        fontSize: '25px',
                        fontWeight: 600,
                        lineHeight: 1.05,
                        whiteSpace: 'pre-line',
                        letterSpacing: 0,
                    }}
                >
                    {formatMessage({id: 'prices.switcher.daily'})}
                </Typography>

                <CalendarMonthIcon
                    sx={{
                        fontSize: 50,
                        color: isDailyActive ? '#8E24AA' : '#B7B7B7',
                    }}
                />
            </Box>
        </Paper>
    );
};

export default PricingSwitcher;