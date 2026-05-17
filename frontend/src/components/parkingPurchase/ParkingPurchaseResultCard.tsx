import {Avatar, Box, Divider, Paper, Typography} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import {useIntl} from 'react-intl';
import type {ParkingPurchaseDTO} from '@api/ParkingPurchase';
import {formatDateTime, formatMoney} from './utils';

type ParkingPurchaseResultCardProps = {
    purchaseResult: ParkingPurchaseDTO;
    currency: string;
};

const ParkingPurchaseResultCard = ({
                                       purchaseResult,
                                       currency,
                                   }: ParkingPurchaseResultCardProps) => {
    const {formatMessage} = useIntl();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: '20px',
                bgcolor: '#FFFFFF',
                border: '1px solid rgba(46, 125, 50, 0.16)',
                boxShadow: '0 12px 30px rgba(20, 30, 55, 0.06)',
            }}
        >
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1.4, mb: 2}}>
                <Avatar
                    sx={{
                        width: 44,
                        height: 44,
                        bgcolor: 'rgba(46, 125, 50, 0.1)',
                        color: '#2E7D32',
                    }}
                >
                    <CheckCircleRoundedIcon/>
                </Avatar>

                <Box>
                    <Typography sx={{fontSize: 18, fontWeight: 900, color: '#202020'}}>
                        {purchaseResult.mode === 'RESERVATION'
                            ? formatMessage({id: 'parkingPurchase.reservationSuccessTitle'})
                            : formatMessage({id: 'parkingPurchase.successTitle'})}
                    </Typography>

                    <Typography sx={{fontSize: 13, color: '#777777'}}>
                        {formatMessage({id: 'parkingPurchase.successDescription'})}
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{mb: 2}}/>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(3, 1fr)',
                    },
                    gap: 1.5,
                }}
            >
                <Box>
                    <Typography sx={{fontSize: 12, color: '#8B1F9E', fontWeight: 800}}>
                        {formatMessage({id: 'parkingPurchase.assignedSpace'})}
                    </Typography>

                    <Typography sx={{fontSize: 22, fontWeight: 900}}>
                        {purchaseResult.parkingSpace.id}
                    </Typography>

                    <Typography sx={{fontSize: 13, color: '#777777'}}>
                        {formatMessage(
                            {id: 'parkingPurchase.level'},
                            {level: purchaseResult.parkingSpace.level},
                        )}
                    </Typography>
                </Box>

                <Box>
                    <Typography sx={{fontSize: 12, color: '#8B1F9E', fontWeight: 800}}>
                        {formatMessage({id: 'parkingPurchase.validTime'})}
                    </Typography>

                    <Typography sx={{fontSize: 14, fontWeight: 800}}>
                        {formatDateTime(purchaseResult.startTime)}
                    </Typography>

                    <Typography sx={{fontSize: 13, color: '#777777'}}>
                        {formatMessage({id: 'parkingPurchase.to'})} {formatDateTime(purchaseResult.endTime)}
                    </Typography>
                </Box>

                <Box>
                    <Typography sx={{fontSize: 12, color: '#8B1F9E', fontWeight: 800}}>
                        {formatMessage({id: 'parkingPurchase.paid'})}
                    </Typography>

                    <Typography sx={{fontSize: 18, fontWeight: 900}}>
                        {formatMoney(purchaseResult.price, purchaseResult.currency ?? currency)}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default ParkingPurchaseResultCard;