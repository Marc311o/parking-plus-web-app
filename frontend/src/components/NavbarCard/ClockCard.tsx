import {useEffect, useState} from 'react';
import {Paper, Typography} from '@mui/material';
import {useIntl} from 'react-intl';

const ClockCard = () => {
    const intl = useIntl();
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);

        return () => clearInterval(interval);
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
            <Typography variant="h5" sx={{color: 'text.primary', fontWeight: 600}}>
                {intl.formatTime(now, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                })}
            </Typography>

            <Typography variant="caption" sx={{color: 'text.primary', mt: 0.5}}>
                {intl.formatDate(now, {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })}
            </Typography>
        </Paper>
    );
};

export default ClockCard;