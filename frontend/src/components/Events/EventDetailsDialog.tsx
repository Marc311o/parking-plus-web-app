import {
    Avatar,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    Typography,
} from '@mui/material';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';

import { useIntl } from 'react-intl';
import { useState, useEffect } from 'react';

import type { ParkingEventDTO } from '@api/Events';

interface Props {
    open: boolean;
    event: ParkingEventDTO | null;
    onClose: () => void;
}

export default function EventDetailsDialog({
                                               open,
                                               event,
                                               onClose,
                                           }: Props) {
    const { formatMessage } = useIntl();

    const [imgOk, setImgOk] = useState(true);

    useEffect(() => {
        if (open) setImgOk(true);
    }, [open, event?.carPhotoPath]);

    if (!event) return null;

    const InfoRow = ({
                         label,
                         value,
                     }: {
        label: string;
        value?: string;
    }) => (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                py: 1,
                borderBottom: '1px solid rgba(0,0,0,0.06)',
            }}
        >
            {/* LABEL */}
            <Typography
                sx={{
                    fontWeight: 600,
                    color: '#6B7280',
                    minWidth: 180,
                    flexShrink: 0,
                }}
            >
                {label}
            </Typography>

            {/* VALUE */}
            <Typography
                sx={{
                    fontWeight: 700,
                    flex: 1,
                    textAlign: 'right',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                    whiteSpace: 'normal',
                }}
            >
                {value ?? '-'}
            </Typography>
        </Box>
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            {/* CLOSE BUTTON */}
            <IconButton
                onClick={onClose}
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

            {/* HEADER */}
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
                        <DirectionsCarRoundedIcon />
                    </Avatar>

                    <Box>
                        <Typography sx={{ fontSize: 18, fontWeight: 800 }}>
                            {formatMessage({ id: 'events.details.title' })}
                        </Typography>

                        <Typography sx={{ fontSize: 13, opacity: 0.85 }}>
                            {event.plateNumber}
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            {/* CONTENT */}
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
                        }}
                    >
                        <InfoRow
                            label={formatMessage({
                                id: 'events.details.plate',
                            })}
                            value={event.plateNumber}
                        />

                        <InfoRow
                            label={formatMessage({
                                id: 'events.details.type',
                            })}
                            value={
                                event.eventType === 'ENTRY'
                                    ? formatMessage({ id: 'events.entry' })
                                    : formatMessage({ id: 'events.exit' })
                            }
                        />

                        <InfoRow
                            label={formatMessage({
                                id: 'events.details.date',
                            })}
                            value={new Date(event.eventDate).toLocaleString(
                                'pl-PL',
                                {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }
                            )}
                        />

                        <InfoRow
                            label={formatMessage({
                                id: 'events.details.ownerName',
                            })}
                            value={event.ownerName}
                        />

                        <InfoRow
                            label={formatMessage({
                                id: 'events.details.ownerSurname',
                            })}
                            value={event.ownerSurname}
                        />

                        <InfoRow
                            label={formatMessage({
                                id: 'events.details.ownerEmail',
                            })}
                            value={event.ownerEmail}
                        />

                        {event.carPhotoPath && imgOk && (
                            <Box
                                sx={{
                                    mt: 2,
                                    width: '100%',
                                    height: 240,
                                    overflow: 'hidden',
                                    bgcolor: '#000',
                                    borderRadius: 2,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={event.carPhotoPath}
                                    alt={event.plateNumber}
                                    onError={() => setImgOk(false)}
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block',
                                    }}
                                />
                            </Box>
                        )}
                    </Paper>
                </Box>
            </DialogContent>
        </Dialog>
    );
}