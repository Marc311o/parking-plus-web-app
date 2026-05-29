import {Alert, Box, Paper, Stack, TextField, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import type {ParkingPurchaseMode} from '@api/ParkingPurchase';
import {toDateInputValue, toTimeInputValue} from './utils';

type ParkingPurchaseTimeCardProps = {
    mode: ParkingPurchaseMode;
    isDisabled: boolean;
    purchaseEndDate: string;
    purchaseEndTime: string;
    reservationStartDate: string;
    reservationStartTime: string;
    reservationEndDate: string;
    reservationEndTime: string;
    onPurchaseEndDateChange: (value: string) => void;
    onPurchaseEndTimeChange: (value: string) => void;
    onReservationStartDateChange: (value: string) => void;
    onReservationStartTimeChange: (value: string) => void;
    onReservationEndDateChange: (value: string) => void;
    onReservationEndTimeChange: (value: string) => void;
};

const inputSx = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '14px',
        bgcolor: '#FFFFFF',
    },
};

const ParkingPurchaseTimeCard = ({
                                     mode,
                                     isDisabled,
                                     purchaseEndDate,
                                     purchaseEndTime,
                                     reservationStartDate,
                                     reservationStartTime,
                                     reservationEndDate,
                                     reservationEndTime,
                                     onPurchaseEndDateChange,
                                     onPurchaseEndTimeChange,
                                     onReservationStartDateChange,
                                     onReservationStartTimeChange,
                                     onReservationEndDateChange,
                                     onReservationEndTimeChange,
                                 }: ParkingPurchaseTimeCardProps) => {
    const {formatMessage} = useIntl();
    const today = toDateInputValue(new Date());
    const currentTime = toTimeInputValue(new Date());

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                borderRadius: '20px',
                bgcolor: '#FFFFFF',
                border: '1px solid rgba(139, 31, 158, 0.09)',
            }}
        >
            <Stack spacing={2}>
                <Box>
                    <Typography sx={{fontSize: 18, fontWeight: 900, color: '#202020'}}>
                        {formatMessage({id: 'parkingPurchase.timeSectionTitle'})}
                    </Typography>

                    <Typography sx={{fontSize: 13, color: '#777777', mt: 0.4}}>
                        {mode === 'PURCHASE'
                            ? formatMessage({id: 'parkingPurchase.purchaseTimeDescription'})
                            : formatMessage({id: 'parkingPurchase.reservationTimeDescription'})}
                    </Typography>
                </Box>

                {mode === 'INDEFINITE' ? (
                    <Box sx={{ p: 2, bgcolor: '#FBF7FC', borderRadius: '14px', border: '1px dashed rgba(139, 31, 158, 0.2)' }}>
                        <Typography sx={{ fontSize: 14, color: '#8B1F9E', fontWeight: 600 }}>
                            {formatMessage({id: 'parkingPurchase.indefiniteDescription'})}
                        </Typography>
                    </Box>
                ) : mode === 'PURCHASE' ? (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '1fr 1fr',
                            },
                            gap: 2,
                        }}
                    >
                        <TextField
                            fullWidth
                            type="date"
                            label={formatMessage({id: 'parkingPurchase.purchaseEndDate'})}
                            value={purchaseEndDate}
                            onChange={(event) => onPurchaseEndDateChange(event.target.value)}
                            disabled={isDisabled}
                            InputLabelProps={{shrink: true}}
                            inputProps={{ min: today }}
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            type="time"
                            label={formatMessage({id: 'parkingPurchase.purchaseEndTime'})}
                            value={purchaseEndTime}
                            onChange={(event) => onPurchaseEndTimeChange(event.target.value)}
                            disabled={isDisabled}
                            InputLabelProps={{shrink: true}}
                            inputProps={{ min: purchaseEndDate === today ? currentTime : undefined }}
                            sx={inputSx}
                        />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '1fr 1fr',
                            },
                            gap: 2,
                        }}
                    >
                        <TextField
                            fullWidth
                            type="date"
                            label={formatMessage({id: 'parkingPurchase.parkingStartDate'})}
                            value={reservationStartDate}
                            onChange={(event) => onReservationStartDateChange(event.target.value)}
                            disabled={isDisabled}
                            InputLabelProps={{shrink: true}}
                            inputProps={{ min: today }}
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            type="time"
                            label={formatMessage({id: 'parkingPurchase.parkingStartTime'})}
                            value={reservationStartTime}
                            onChange={(event) => onReservationStartTimeChange(event.target.value)}
                            disabled={isDisabled}
                            InputLabelProps={{shrink: true}}
                            inputProps={{ min: reservationStartDate === today ? currentTime : undefined }}
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            type="date"
                            label={formatMessage({id: 'parkingPurchase.parkingEndDate'})}
                            value={reservationEndDate}
                            onChange={(event) => onReservationEndDateChange(event.target.value)}
                            disabled={isDisabled}
                            InputLabelProps={{shrink: true}}
                            inputProps={{ min: reservationStartDate || today }}
                            sx={inputSx}
                        />

                        <TextField
                            fullWidth
                            type="time"
                            label={formatMessage({id: 'parkingPurchase.parkingEndTime'})}
                            value={reservationEndTime}
                            onChange={(event) => onReservationEndTimeChange(event.target.value)}
                            disabled={isDisabled}
                            InputLabelProps={{shrink: true}}
                            inputProps={{ min: reservationEndDate === reservationStartDate ? reservationStartTime : (reservationEndDate === today ? currentTime : undefined) }}
                            sx={inputSx}
                        />
                    </Box>
                )}
            </Stack>
        </Paper>
    );
};

export default ParkingPurchaseTimeCard;