import {useCallback, useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {
    Alert,
    Avatar,
    Box,
    Button,
    CircularProgress,
    Divider,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import {useIntl} from 'react-intl';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';

import {API_URL, getHeaders} from '../api/core';
import {formatMoney, formatDateTime} from '../components/parkingPurchase/utils';
import {useAuthStore} from '../store/useAuthStore';

type CheckoutDetailsDTO = {
    fee: number;
    startTime: string;
    durationMinutes: number;
};

const formatDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if (hours > 0) {
        return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
};

const PayParkingPage = () => {
    const {formatMessage} = useIntl();
    const [searchParams] = useSearchParams();
    const parkingId = searchParams.get('id');
    const plate = searchParams.get('plate');

    const [details, setDetails] = useState<CheckoutDetailsDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaying, setIsPurchasing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const balance = useAuthStore((state) => state.user?.balance ?? 0);
    const setBalance = useAuthStore((state) => state.setBalance);

    const fetchFee = useCallback(async () => {
        if (!parkingId) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/parking-history/checkout/${parkingId}/fee`, {
                headers: getHeaders(),
            });
            if (!response.ok) throw new Error('Failed to fetch fee');
            const data: CheckoutDetailsDTO = await response.json();
            setDetails(data);
        } catch (err) {
            console.error(err);
            setError(formatMessage({id: 'parkingPurchase.errors.quote'}));
        } finally {
            setIsLoading(false);
        }
    }, [parkingId, formatMessage]);

    useEffect(() => {
        void fetchFee();
    }, [fetchFee]);

    const handlePay = async () => {
        if (!parkingId) return;
        setIsPurchasing(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/parking-history/checkout/${parkingId}`, {
                method: 'POST',
                headers: getHeaders(),
            });
            if (!response.ok) {
                const body = await response.text();
                throw new Error(body || 'Payment failed');
            }
            const data: { price: number } = await response.json();
            setSuccess(true);
            setBalance(balance - data.price);
        } catch (err: any) {
            console.error(err);
            setError(err.message || formatMessage({id: 'parkingPurchase.errors.purchase'}));
        } finally {
            setIsPurchasing(false);
        }
    };

    if (success) {
        return (
            <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        borderRadius: '22px',
                        textAlign: 'center',
                        border: '1px solid rgba(76, 175, 80, 0.2)',
                        boxShadow: '0 24px 54px rgba(20, 30, 55, 0.08)',
                    }}
                >
                    <Stack spacing={3} alignItems="center">
                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' }}>
                            <CheckCircleRoundedIcon sx={{ fontSize: 48 }} />
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontSize: 24, fontWeight: 900 }}>
                                {formatMessage({id: 'payParking.success.title'})}
                            </Typography>
                            <Typography sx={{ color: '#777777', mt: 1 }}>
                                {formatMessage({id: 'payParking.success.message'})}
                            </Typography>
                        </Box>
                        <Button 
                            variant="outlined" 
                            fullWidth 
                            href="/dashboard"
                            sx={{ borderRadius: '14px', textTransform: 'none', fontWeight: 800, height: 48 }}
                        >
                            {formatMessage({id: 'payParking.success.backButton'})}
                        </Button>
                    </Stack>
                </Paper>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
            <Paper
                elevation={0}
                sx={{
                    overflow: 'hidden',
                    borderRadius: '22px',
                    border: '1px solid rgba(139, 31, 158, 0.1)',
                    boxShadow: '0 24px 54px rgba(20, 30, 55, 0.08)',
                }}
            >
                <Box sx={{ p: 3, bgcolor: '#8B1F9E', color: '#FFFFFF' }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 900 }}>
                        {formatMessage({id: 'payParking.title'})}
                    </Typography>
                    <Typography sx={{ fontSize: 14, opacity: 0.8 }}>
                        {formatMessage({id: 'payParking.subtitle'})}
                    </Typography>
                </Box>

                <Box sx={{ p: 3, bgcolor: '#FBF7FC' }}>
                    <Stack spacing={3}>
                        {error && <Alert severity="error" sx={{ borderRadius: '14px' }}>{error}</Alert>}

                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'rgba(139, 31, 158, 0.1)', color: '#8B1F9E' }}>
                                    <DirectionsCarRoundedIcon />
                                </Avatar>
                                <Box>
                                    <Typography sx={{ fontSize: 13, color: '#777777', fontWeight: 700 }}>
                                        {formatMessage({id: 'payParking.labels.vehicle'})}
                                    </Typography>
                                    <Typography sx={{ fontSize: 18, fontWeight: 900 }}>{plate ?? '-'}</Typography>
                                </Box>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'rgba(139, 31, 158, 0.1)', color: '#8B1F9E' }}>
                                    <EventAvailableRoundedIcon />
                                </Avatar>
                                <Box>
                                    <Typography sx={{ fontSize: 13, color: '#777777', fontWeight: 700 }}>
                                        {formatMessage({id: 'payParking.labels.entry'})}
                                    </Typography>
                                    <Typography sx={{ fontSize: 14, fontWeight: 800 }}>
                                        {isLoading ? <CircularProgress size={14} /> : (details ? formatDateTime(details.startTime) : '-')}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, color: '#8B1F9E', fontWeight: 700 }}>
                                        {details ? formatMessage({id: 'payParking.labels.duration'}, {duration: formatDuration(details.durationMinutes)}) : ''}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Divider />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: 'rgba(139, 31, 158, 0.1)', color: '#8B1F9E' }}>
                                    <AccessTimeRoundedIcon />
                                </Avatar>
                                <Box>
                                    <Typography sx={{ fontSize: 13, color: '#777777', fontWeight: 700 }}>
                                        {formatMessage({id: 'payParking.labels.currentFee'})}
                                    </Typography>
                                    <Typography sx={{ fontSize: 22, fontWeight: 900 }}>
                                        {isLoading ? <CircularProgress size={20} /> : (details !== null ? formatMoney(details.fee, 'PLN') : '-')}
                                    </Typography>
                                </Box>
                            </Box>
                            <Button 
                                size="small" 
                                onClick={fetchFee}
                                disabled={isLoading}
                                sx={{ textTransform: 'none', fontWeight: 700 }}
                            >
                                {formatMessage({id: 'payParking.buttons.refresh'})}
                            </Button>
                        </Box>

                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                borderRadius: '16px',
                                bgcolor: '#FFFFFF',
                                border: '1px solid rgba(139, 31, 158, 0.1)',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(193, 59, 219, 0.1)', color: '#8B1F9E' }}>
                                    <AccountBalanceWalletRoundedIcon sx={{ fontSize: 18 }} />
                                </Avatar>
                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#8B1F9E' }}>
                                        {formatMessage({id: 'payParking.labels.balance'})}
                                    </Typography>
                                    <Typography sx={{ fontSize: 16, fontWeight: 900 }}>{formatMoney(balance, 'PLN')}</Typography>
                                </Box>
                                {balance < (details?.fee ?? 0) && (
                                    <Typography sx={{ fontSize: 12, fontWeight: 800, color: '#D32F2F' }}>
                                        {formatMessage({id: 'payParking.labels.insufficientFunds'})}
                                    </Typography>
                                )}
                            </Box>
                        </Paper>

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={isLoading || isPaying || details === null || balance < details.fee}
                            onClick={handlePay}
                            sx={{
                                height: 52,
                                borderRadius: '14px',
                                bgcolor: '#9C13B8',
                                textTransform: 'none',
                                fontSize: 16,
                                fontWeight: 800,
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#7F0F96', boxShadow: 'none' },
                            }}
                        >
                            {isPaying ? formatMessage({id: 'payParking.buttons.processing'}) : formatMessage({id: 'payParking.buttons.pay'})}
                        </Button>

                        {balance < (details?.fee ?? 0) && (
                            <Typography sx={{ fontSize: 13, color: '#777777', textAlign: 'center' }}>
                                {formatMessage({id: 'payParking.labels.topUpPrompt'})}
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
};

export default PayParkingPage;
