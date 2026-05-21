import {
    Avatar,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Typography,
    Chip,
} from '@mui/material';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EventSeatIcon from '@mui/icons-material/EventSeat';

import type { CarType } from '@api/MyCars';
import type { ReservationDetailsDTO } from '@api/MyReservations';
import { useIntl } from 'react-intl';

interface Props {
    open: boolean;
    reservation: ReservationDetailsDTO | null;
    onClose: () => void;
}

export default function ReservationDetailsDialog({
                                                     open,
                                                     reservation,
                                                     onClose,
                                                 }: Props) {
    const { formatMessage } = useIntl();

    const handleClose = () => {
        onClose();
    };

    const getStatusColor = () => {
        switch (reservation?.status) {
            case 'CONFIRMED':
                return '#2e7d32';
            case 'PENDING':
                return '#ed6c02';
            case 'CANCELLED':
                return '#d32f2f';
            case 'COMPLETED':
                return '#1565c0';
            default:
                return '#757575';
        }
    };

    const formatStatus = (status?: string) => {
        if (!status) return '-';

        return formatMessage({
            id: `reservationDetails.statusValues.${status}`,
        });
    };

    const formatVehicleType = (type?: CarType) => {
        if (!type) return '-';

        return formatMessage({
            id: `reservationDetails.vehicleTypeValues.${type}`,
        });
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <IconButton
                onClick={handleClose}
                disableRipple
                sx={{
                    position: 'absolute',
                    top: 22,
                    right: 16,
                    zIndex: 2,
                    color: '#FFFFFF',
                    p: 0,
                    '&:hover': {
                        bgcolor: 'transparent',
                        opacity: 0.75,
                    },
                }}
            >
                <CloseRoundedIcon />
            </IconButton>

            <DialogTitle
                sx={{
                    p: 0,
                    background:
                        'linear-gradient(135deg, #5E076E 0%, #C13BDB 100%)',
                    color: '#FFFFFF',
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        pr: 7,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 48,
                            height: 48,
                            bgcolor: 'rgba(255,255,255,0.18)',
                            color: '#FFFFFF',
                        }}
                    >
                        <EventSeatIcon />
                    </Avatar>

                    <Typography sx={{ fontSize: 18, fontWeight: 800 }}>
                        {formatMessage({ id: 'reservationDetails.title' })}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0, bgcolor: '#FBF7FC' }}>
                <Box sx={{ p: 3 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: '16px',
                            bgcolor: '#FFFFFF',
                            border: '1px solid rgba(139, 31, 158, 0.12)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        {/* STATUS */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                                {formatMessage({ id: 'reservationDetails.status' })}
                            </Typography>

                            <Chip
                                label={formatStatus(reservation?.status)}
                                sx={{
                                    bgcolor: getStatusColor(),
                                    color: '#FFFFFF',
                                    fontWeight: 700,
                                }}
                            />
                        </Box>

                        <InfoRow
                            label={formatMessage({ id: 'reservationDetails.createdAt' })}
                            value={reservation?.created_at}
                        />

                        <InfoRow
                            label={formatMessage({ id: 'reservationDetails.startTime' })}
                            value={reservation?.start_time}
                        />

                        <InfoRow
                            label={formatMessage({ id: 'reservationDetails.endTime' })}
                            value={reservation?.end_time}
                        />

                        <InfoRow
                            label={formatMessage({ id: 'reservationDetails.price' })}
                            value={
                                reservation?.price != null
                                    ? `${reservation.price.toFixed(2)} zł`
                                    : '-'
                            }
                        />

                        <InfoRow
                            label={formatMessage({ id: 'reservationDetails.parkingPlace' })}
                            value={reservation?.parking_place_id}
                        />

                        <InfoRow
                            label={formatMessage({ id: 'reservationDetails.vehiclePlate' })}
                            value={reservation?.vehicle_licence_plate}
                        />

                        <InfoRow
                            label={formatMessage({ id: 'reservationDetails.vehicleType' })}
                            value={formatVehicleType(reservation?.vehicle_type)}
                        />
                    </Paper>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

interface InfoRowProps {
    label: string;
    value?: string | number;
}

function InfoRow({ label, value }: InfoRowProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                py: 1,
                borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
        >
            <Typography sx={{ fontWeight: 600, color: '#6B7280' }}>
                {label}
            </Typography>

            <Typography sx={{ fontWeight: 700, textAlign: 'right' }}>
                {value ?? '-'}
            </Typography>
        </Box>
    );
}