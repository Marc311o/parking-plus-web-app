import {Avatar, Box, Paper, Typography} from '@mui/material';
import LocalParkingRoundedIcon from '@mui/icons-material/LocalParkingRounded';
import {useIntl} from 'react-intl';

const ParkingPurchaseHero = () => {
    const {formatMessage} = useIntl();

    return (
        <Paper
            elevation={0}
            sx={{
                overflow: 'hidden',
                borderRadius: '22px',
                border: '1px solid rgba(139, 31, 158, 0.1)',
                boxShadow: '0 18px 42px rgba(20, 30, 55, 0.08)',
            }}
        >
            <Box
                sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #5E076E 0%, #C13BDB 100%)',
                    color: '#FFFFFF',
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                    <Avatar
                        sx={{
                            width: 52,
                            height: 52,
                            bgcolor: 'rgba(255,255,255,0.18)',
                            color: '#FFFFFF',
                            border: '1px solid rgba(255,255,255,0.28)',
                        }}
                    >
                        <LocalParkingRoundedIcon/>
                    </Avatar>

                    <Box>
                        <Typography sx={{fontSize: 24, fontWeight: 900, lineHeight: 1.1}}>
                            {formatMessage({id: 'parkingPurchase.title'})}
                        </Typography>

                        <Typography sx={{fontSize: 14, opacity: 0.85, mt: 0.7}}>
                            {formatMessage({id: 'parkingPurchase.subtitle'})}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default ParkingPurchaseHero;