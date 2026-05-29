import {Avatar, Box, Button, CircularProgress, Divider, Paper, Stack, Typography} from '@mui/material';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import {useIntl} from 'react-intl';
import type {ParkingPurchaseMode, ParkingQuoteDTO, VehicleDTO} from '@api/ParkingPurchase';
import {formatDateTime, formatMoney} from './utils';

type ParkingPurchaseSummaryProps = {
    mode: ParkingPurchaseMode;
    selectedVehicle: VehicleDTO | null;
    balance: number | null;
    currency: string;
    quote: ParkingQuoteDTO | null;
    isQuoteLoading: boolean;
    reservationStartDateTime: string | null;
    parkingEndDateTime: string | null;
    onPurchase: () => void;
    isPurchasing: boolean;
    canPurchase: boolean;
};

const ParkingPurchaseSummary = ({
                                    mode,
                                    selectedVehicle,
                                    balance,
                                    currency,
                                    quote,
                                    isQuoteLoading,
                                    reservationStartDateTime,
                                    parkingEndDateTime,
                                    onPurchase,
                                    isPurchasing,
                                    canPurchase,
                                }: ParkingPurchaseSummaryProps) => {
    const {formatMessage} = useIntl();

    return (
        <Box
            sx={{
                height: {
                    xs: 'auto',
                    lg: '100%',
                },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                gap: 2.5,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: 2.5,
                    borderRadius: '22px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(139, 31, 158, 0.1)',
                    boxShadow: '0 18px 42px rgba(20, 30, 55, 0.08)',
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5}}>
                    <Avatar
                        sx={{
                            width: 46,
                            height: 46,
                            bgcolor: 'rgba(193, 59, 219, 0.1)',
                            color: '#8B1F9E',
                        }}
                    >
                        <AccountBalanceWalletRoundedIcon/>
                    </Avatar>

                    <Box>
                        <Typography sx={{fontSize: 13, fontWeight: 800, color: '#8B1F9E'}}>
                            {formatMessage({id: 'parkingPurchase.balance'})}
                        </Typography>

                        <Typography sx={{fontSize: 26, fontWeight: 900, color: '#202020'}}>
                            {balance === null ? '-' : formatMoney(balance, currency)}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            <Paper
                elevation={0}
                sx={{
                    flex: 1,
                    p: 2.5,
                    borderRadius: '22px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid rgba(139, 31, 158, 0.1)',
                    boxShadow: '0 18px 42px rgba(20, 30, 55, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1.5, mb: 2}}>
                    <Avatar
                        sx={{
                            width: 46,
                            height: 46,
                            bgcolor: 'rgba(193, 59, 219, 0.1)',
                            color: '#8B1F9E',
                        }}
                    >
                        <ConfirmationNumberRoundedIcon/>
                    </Avatar>

                    <Box>
                        <Typography sx={{fontSize: 18, fontWeight: 900, color: '#202020'}}>
                            {formatMessage({id: 'parkingPurchase.summaryTitle'})}
                        </Typography>

                        <Typography sx={{fontSize: 13, color: '#777777'}}>
                            {formatMessage({id: 'parkingPurchase.summaryDescription'})}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{mb: 2}}/>

                <Stack spacing={1.6} sx={{ flex: 1 }}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2}}>
                        <Typography sx={{fontSize: 14, color: '#777777'}}>
                            {formatMessage({id: 'parkingPurchase.summaryMode'})}
                        </Typography>

                        <Typography sx={{fontSize: 14, fontWeight: 800, textAlign: 'right'}}>
                            {mode === 'RESERVATION'
                                ? formatMessage({id: 'parkingPurchase.modeReservation'})
                                : mode === 'INDEFINITE'
                                    ? formatMessage({id: 'parkingPurchase.modeIndefinite'})
                                    : formatMessage({id: 'parkingPurchase.modePurchase'})}
                        </Typography>
                    </Box>

                    <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2}}>
                        <Typography sx={{fontSize: 14, color: '#777777'}}>
                            {formatMessage({id: 'parkingPurchase.summaryVehicle'})}
                        </Typography>

                        <Typography sx={{fontSize: 14, fontWeight: 800, textAlign: 'right'}}>
                            {selectedVehicle?.licensePlate ?? '-'}
                        </Typography>
                    </Box>

                    <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2}}>
                        <Typography sx={{fontSize: 14, color: '#777777'}}>
                            {formatMessage({id: 'parkingPurchase.summaryStart'})}
                        </Typography>

                        <Typography sx={{fontSize: 14, fontWeight: 800, textAlign: 'right'}}>
                            {mode === 'PURCHASE' || mode === 'INDEFINITE'
                                ? formatMessage({id: 'parkingPurchase.now'})
                                : reservationStartDateTime
                                    ? formatDateTime(reservationStartDateTime)
                                    : '-'}
                        </Typography>
                    </Box>

                    <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2}}>
                        <Typography sx={{fontSize: 14, color: '#777777'}}>
                            {formatMessage({id: 'parkingPurchase.summaryEnd'})}
                        </Typography>

                        <Typography sx={{fontSize: 14, fontWeight: 800, textAlign: 'right'}}>
                            {mode === 'INDEFINITE'
                                ? formatMessage({id: 'parkingPurchase.indefiniteEndDate'})
                                : parkingEndDateTime ? formatDateTime(parkingEndDateTime) : '-'}
                        </Typography>
                    </Box>

                    <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2}}>
                        <Typography sx={{fontSize: 14, color: '#777777'}}>
                            {formatMessage({id: 'parkingPurchase.summaryPrice'})}
                        </Typography>

                        <Typography sx={{fontSize: 18, fontWeight: 900, color: '#202020'}}>
                            {isQuoteLoading ? (
                                <CircularProgress size={18}/>
                            ) : mode === 'INDEFINITE' ? (
                                formatMessage({id: 'parkingPurchase.indefinitePrice'})
                            ) : quote ? (
                                formatMoney(quote.price, quote.currency ?? currency)
                            ) : (
                                '-'
                            )}
                        </Typography>
                    </Box>

                    <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2}}>
                        <Typography sx={{fontSize: 14, color: '#777777'}}>
                            {formatMessage({id: 'parkingPurchase.summaryBalanceAfter'})}
                        </Typography>

                        <Typography sx={{fontSize: 14, fontWeight: 800}}>
                            {mode === 'INDEFINITE' ? (
                                balance === null ? '-' : formatMoney(balance, currency)
                            ) : quote ? (
                                formatMoney(quote.balanceAfter, quote.currency ?? currency)
                            ) : (
                                '-'
                            )}
                        </Typography>
                    </Box>
                </Stack>

                <Box sx={{ mt: 3 }}>
                    <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={!canPurchase}
                        onClick={onPurchase}
                        sx={{
                            height: 48,
                            borderRadius: '13px',
                            bgcolor: '#9C13B8',
                            textTransform: 'none',
                            fontSize: 16,
                            fontWeight: 800,
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: '#7F0F96',
                                boxShadow: 'none',
                            },
                        }}
                    >
                        {isPurchasing
                            ? formatMessage({id: 'parkingPurchase.processingButton'})
                            : mode === 'RESERVATION'
                                ? formatMessage({id: 'parkingPurchase.reserveButton'})
                                : formatMessage({id: 'parkingPurchase.buyButton'})}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default ParkingPurchaseSummary;