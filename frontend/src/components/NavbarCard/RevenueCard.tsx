import {useEffect, useState} from 'react';
import {Paper, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import {getDailyRevenue} from '@api/parkingHistory';

const getLocalDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const RevenueCard = () => {
    const {formatMessage} = useIntl();
    const [value, setValue] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDailyRevenue = async () => {
            try {
                setIsLoading(true);
                const today = getLocalDate();
                const revenue = await getDailyRevenue(today);

                setValue(revenue);
            } catch (error) {
                console.error('Failed to fetch daily revenue:', error);
                setValue(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDailyRevenue();
    }, []);

    return (
        <Paper
            elevation={0}
            sx={{
                minHeight: 130,
                px: 3,
                py: 2,
                borderRadius: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }}
        >
            <Typography
                sx={{
                    fontFamily: 'inherit',
                    fontSize: '28px',
                    fontWeight: 400,
                    color: '#008A38',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    mb: 1.1,
                }}
            >
                {isLoading
                    ? '...'
                    : formatMessage(
                        {id: 'navbar.revenue.value'},
                        {value: value.toFixed(2).replace('.', ',')}
                    )}
            </Typography>

            <Typography
                sx={{
                    fontFamily: 'inherit',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#111111',
                    lineHeight: 1.1,
                    letterSpacing: '-0.01em',
                    textAlign: 'center',
                }}
            >
                {formatMessage({id: 'navbar.revenue.label'})}
            </Typography>
        </Paper>
    );
};

export default RevenueCard;