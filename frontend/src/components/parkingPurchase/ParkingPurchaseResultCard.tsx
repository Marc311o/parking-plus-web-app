import {useState} from 'react';
import {Avatar, Box, Button, Divider, Paper, Stack, Typography} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import {useIntl} from 'react-intl';
import type {ParkingPurchaseDTO} from '@api/ParkingPurchase';
import {formatDateTime, formatMoney} from './utils';
import {QRCode} from '../Common';

type ParkingPurchaseResultCardProps = {
    purchaseResult: ParkingPurchaseDTO;
    currency: string;
};

const ParkingPurchaseResultCard = ({
                                       purchaseResult,
                                       currency,
                                   }: ParkingPurchaseResultCardProps) => {
    const {formatMessage} = useIntl();
    const isIndefinite = purchaseResult.mode === 'INDEFINITE';
    const paymentUrl = `${window.location.origin}/pay-parking?id=${encodeURIComponent(String(purchaseResult.id))}&plate=${encodeURIComponent(purchaseResult.licensePlate)}`;

    const [copied, setCopied] = useState(false);

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(paymentUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleDownloadQR = () => {
        const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement | null;
        if (canvas) {
            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `parking-qr-${purchaseResult.licensePlate}.png`;
            link.href = url;
            link.click();
        }
    };

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
                        {isIndefinite 
                            ? formatMessage({id: 'parkingPurchase.qrSuccessTitle'})
                            : (purchaseResult.mode === 'RESERVATION'
                                ? formatMessage({id: 'parkingPurchase.reservationSuccessTitle'})
                                : formatMessage({id: 'parkingPurchase.successTitle'}))}
                    </Typography>

                    <Typography sx={{fontSize: 13, color: '#777777'}}>
                        {isIndefinite 
                            ? formatMessage({id: 'parkingPurchase.qrSuccessDescription'})
                            : formatMessage({id: 'parkingPurchase.successDescription'})}
                    </Typography>
                </Box>
            </Box>

            {isIndefinite && (
                <Box sx={{ mb: 3, p: 3, bgcolor: '#FBF7FC', borderRadius: '16px', border: '1px solid rgba(139, 31, 158, 0.1)' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                        <Stack alignItems="center" spacing={1.5}>
                            <QRCode id="qr-canvas" value={paymentUrl} size={180} />
                            <Typography sx={{ fontSize: 16, fontWeight: 900, color: '#8B1F9E', textAlign: 'center', letterSpacing: 1 }}>
                                {purchaseResult.licensePlate}
                            </Typography>
                        </Stack>
                        
                        <Stack spacing={2} sx={{ minWidth: 200 }}>
                            <Button
                                variant="outlined"
                                startIcon={<DownloadRoundedIcon />}
                                onClick={handleDownloadQR}
                                sx={{
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontWeight: 800,
                                    color: '#8B1F9E',
                                    borderColor: 'rgba(139, 31, 158, 0.3)',
                                    '&:hover': {
                                        borderColor: '#8B1F9E',
                                        bgcolor: 'rgba(139, 31, 158, 0.04)',
                                    }
                                }}
                            >
                                {formatMessage({id: 'parkingPurchase.qrDownloadPng'})}
                            </Button>
                            
                            <Button
                                variant="outlined"
                                startIcon={copied ? <CheckRoundedIcon /> : <ContentCopyRoundedIcon />}
                                onClick={handleCopyUrl}
                                color={copied ? "success" : "primary"}
                                sx={{
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontWeight: 800,
                                    ...(copied ? {} : {
                                        color: '#8B1F9E',
                                        borderColor: 'rgba(139, 31, 158, 0.3)',
                                        '&:hover': {
                                            borderColor: '#8B1F9E',
                                            bgcolor: 'rgba(139, 31, 158, 0.04)',
                                        }
                                    })
                                }}
                            >
                                {copied ? formatMessage({id: 'parkingPurchase.qrCopied'}) : formatMessage({id: 'parkingPurchase.qrCopyLink'})}
                            </Button>
                        </Stack>
                    </Box>
                </Box>
            )}

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
                        {formatMessage({id: 'parkingPurchase.to'})} {purchaseResult.endTime ? formatDateTime(purchaseResult.endTime) : formatMessage({id: 'parkingPurchase.indefiniteEndDate'})}
                    </Typography>
                </Box>

                <Box>
                    <Typography sx={{fontSize: 12, color: '#8B1F9E', fontWeight: 800}}>
                        {formatMessage({id: 'parkingPurchase.paid'})}
                    </Typography>

                    <Typography sx={{fontSize: 18, fontWeight: 900}}>
                        {isIndefinite ? formatMessage({id: 'parkingPurchase.indefinitePrice'}) : formatMoney(purchaseResult.price, purchaseResult.currency ?? currency)}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
};

export default ParkingPurchaseResultCard;