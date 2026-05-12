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

import {useIntl} from 'react-intl';

import type {ParkingEventDTO} from '@api/Events';
import {useState, useEffect} from 'react';

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

    const {formatMessage} = useIntl();

    const [imgOk, setImgOk] = useState(true);

    useEffect(() => {
        if (open) {
            setImgOk(true);
        }
    }, [open, event?.carPhotoPath]);

    if (!event) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <IconButton
                onClick={onClose}
                disableRipple
                sx={{
                    position: 'absolute',
                    top: 22,
                    right: 0,
                    zIndex: 2,
                    color: '#FFFFFF',
                    p: 0,
                    '&:hover': {
                        bgcolor: 'transparent',
                        opacity: 0.75,
                    },
                }}
            >
                <CloseRoundedIcon/>
            </IconButton>

            <DialogTitle
                sx={{
                    p: 0,
                    background: 'linear-gradient(135deg, #5E076E 0%, #C13BDB 100%)',
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
                        <DirectionsCarRoundedIcon/>
                    </Avatar>

                    <Box>
                        <Typography sx={{fontSize: 18, fontWeight: 800}}>
                            {formatMessage({id: 'events.details.title'})}
                        </Typography>

                        <Typography sx={{fontSize: 13, opacity: 0.85}}>
                            {event.plateNumber}
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent sx={{p: 0, bgcolor: '#FBF7FC'}}>
                <Box sx={{p: 3}}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: '16px',
                            bgcolor: '#FFFFFF',
                            border: '1px solid rgba(139, 31, 158, 0.12)',
                        }}
                    >
                        <Typography sx={{fontSize: 14, mb: 1}}>
                            <b>{formatMessage({id: 'events.details.plate'})}:</b> {event.plateNumber}
                        </Typography>

                        <Typography sx={{fontSize: 14, mb: 1}}>
                            <b>{formatMessage({id: 'events.details.type'})}:</b>{' '}
                            {event.eventType === 'ENTRY' ? formatMessage({id: 'events.entry'}) : formatMessage({id: 'events.exit'})}
                        </Typography>

                        <Typography sx={{fontSize: 14, mb: 1}}>
                            <b>{formatMessage({id: 'events.details.date'})}:</b> {event.eventDate}
                        </Typography>

                        <Typography sx={{fontSize: 14, mb: 1}}>
                            <b>{formatMessage({id: 'events.details.ownerName'})}:</b> {event.ownerName}
                        </Typography>

                        <Typography sx={{fontSize: 14, mb: 1}}>
                            <b>{formatMessage({id: 'events.details.ownerSurname'})}:</b> {event.ownerSurname}
                        </Typography>

                        <Typography sx={{fontSize: 14, mb: 1}}>
                            <b>{formatMessage({id: 'events.details.ownerEmail'})}:</b> {event.ownerEmail}
                        </Typography>

                        {event.carPhotoPath && imgOk && (
                            <Box
                                sx={{
                                    width: '100%',
                                    height: 240,
                                    overflow: 'hidden',
                                    bgcolor: '#000',
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

                        {/*<Typography sx={{fontSize: 14}}>*/}
                        {/*    <b>{formatMessage({id: 'events.details.id'})}:</b> {event.id}*/}
                        {/*</Typography>*/}
                    </Paper>
                </Box>
            </DialogContent>
        </Dialog>
    );
}