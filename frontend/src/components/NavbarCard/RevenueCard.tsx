import {Paper, Typography} from '@mui/material';
import {useIntl} from 'react-intl';

const RevenueCard = () => {
    const {formatMessage} = useIntl();

    const value = 650;

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
                {formatMessage(
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