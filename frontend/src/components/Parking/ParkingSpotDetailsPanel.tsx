import {Box, Dialog, IconButton, Paper, Typography, Tooltip} from '@mui/material';
import {useIntl} from 'react-intl';
import {useState, useEffect} from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import type {ParkingSpotDetails} from '@api/Dashboard/types';

interface ParkingSpotDetailsPanelProps {
    details: ParkingSpotDetails | null;
}

const labelCellSx = {
    fontSize: 14,
    fontWeight: 600,
    color: '#6B7280',
    minWidth: 140,
    flexShrink: 0,
};

const valueCellSx = {
    fontSize: 14,
    fontWeight: 700,
    color: '#111111',
    flex: 1,
    textAlign: 'right',
    wordBreak: 'break-word',
    overflowWrap: 'anywhere',
    whiteSpace: 'normal',
};

const InfoRow = ({
                     label,
                     value,
                     photoPath,
                     onPhotoClick,
                 }: {
    label: string;
    value?: string | number;
    photoPath?: string | null;
    onPhotoClick?: (path: string) => void;
}) => {
    const {formatMessage} = useIntl();
    
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 1,
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                '&:last-child': {
                    borderBottom: 'none',
                },
            }}
        >
            <Typography sx={labelCellSx}>{label}</Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                <Typography sx={valueCellSx}>{value ?? '-'}</Typography>
                {photoPath && onPhotoClick && (
                    <Tooltip title={formatMessage({id: 'parking.details.labels.viewPhoto'})}>
                        <IconButton
                            onClick={() => onPhotoClick(photoPath)}
                            size="small"
                            sx={{
                                p: 0,
                                borderRadius: '4px',
                                overflow: 'hidden',
                                border: '1px solid rgba(139, 31, 158, 0.2)',
                                '&:hover': {
                                    borderColor: '#5E076E',
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={photoPath}
                                alt={formatMessage({id: 'parking.details.labels.viewPhoto'})}
                                sx={{
                                    width: 40,
                                    height: 32,
                                    objectFit: 'cover',
                                    display: 'block',
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Box>
    );
};

const cardSx = {
    p: 3,
    borderRadius: '16px',
    bgcolor: '#FFFFFF',
    border: '1px solid rgba(139, 31, 158, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
};

const cardTitleSx = {
    fontSize: 18,
    fontWeight: 800,
    color: '#5E076E',
    mb: 2,
};

const formatDateTime = (value?: string | null) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('pl-PL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

const formatDuration = (seconds?: number | null) => {
    if (seconds === undefined || seconds === null) return '-';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts = [];
    if (h > 0) parts.push(`${h} h`);
    if (m > 0 || h > 0) parts.push(`${m} min`);
    parts.push(`${s} s`);

    return parts.join(' ');
};

const formatAmount = (value?: number | null) => {
    if (value === undefined || value === null) return '-';
    return `${value.toFixed(2).replace('.', ',')} zł`;
};

const ParkingSpotDetailsPanel = ({details}: ParkingSpotDetailsPanelProps) => {
    const {formatMessage} = useIntl();
    const [previewImg, setPreviewImg] = useState<string | null>(null);
    const [liveDuration, setLiveDuration] = useState<number>(0);

    useEffect(() => {
        if (details?.occupant?.entryTime) {
            const entryDate = new Date(details.occupant.entryTime);

            const updateDuration = () => {
                const now = new Date();
                const diffMs = now.getTime() - entryDate.getTime();
                setLiveDuration(Math.max(0, Math.floor(diffMs / 1000)));
            };

            updateDuration();
            const interval = setInterval(updateDuration, 1000);
            return () => clearInterval(interval);
        }
    }, [details?.occupant?.entryTime]);

    if (!details) return null;

    const occupant = details.occupant;
    const isOccupied = details.status === 'OCCUPIED' && Boolean(occupant);

    return (
        <Box sx={{mt: 3, p: 0}}>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: 3,
                }}
            >
                {/* SPOT INFO */}
                <Paper elevation={0} sx={cardSx}>
                    <Typography sx={cardTitleSx}>
                        {formatMessage({id: 'parking.details.spotCardTitle'}, {id: details.id})}
                    </Typography>

                    <InfoRow
                        label={formatMessage({id: 'parking.details.labels.type'})}
                        value={formatMessage(
                            {id: `parking.details.spaceTypes.${details.type}`},
                            {defaultMessage: details.type}
                        )}
                    />
                    <InfoRow
                        label={formatMessage({id: 'parking.details.labels.status'})}
                        value={formatMessage(
                            {id: `parking.details.statuses.${details.status}`},
                            {defaultMessage: details.status}
                        )}
                    />
                    <InfoRow
                        label={formatMessage({id: 'parking.details.labels.level'})}
                        value={details.level}
                    />
                </Paper>

                {/* OCCUPANT INFO */}
                {isOccupied && occupant && (
                    <Paper elevation={0} sx={cardSx}>
                        <Typography sx={cardTitleSx}>
                            {formatMessage({id: 'parking.details.ownerCardTitle'}, {id: occupant.ownerId})}
                        </Typography>

                        <InfoRow
                            label={formatMessage({id: 'parking.details.labels.ownerData'})}
                            value={occupant.ownerName}
                        />
                        <InfoRow
                            label={formatMessage({id: 'parking.details.labels.email'})}
                            value={occupant.ownerEmail}
                        />
                        <InfoRow
                            label={formatMessage({id: 'parking.details.labels.plate'})}
                            value={occupant.vehiclePlate}
                        />

                        <Box sx={{mt: 3, pt: 2, borderTop: '2px dashed rgba(139, 31, 158, 0.12)'}}>
                            <InfoRow
                                label={formatMessage({id: 'parking.details.labels.entry'})}
                                value={formatDateTime(occupant.entryTime)}
                                photoPath={occupant.barrierPhotoPath}
                                onPhotoClick={setPreviewImg}
                            />
                            <InfoRow
                                label={formatMessage({id: 'parking.details.labels.parkingTime'})}
                                value={formatDuration(liveDuration)}
                                photoPath={occupant.spotPhotoPath}
                                onPhotoClick={setPreviewImg}
                            />
                            <InfoRow
                                label={formatMessage({id: 'parking.details.labels.amountDue'})}
                                value={formatAmount(occupant.amountDue)}
                            />
                        </Box>
                    </Paper>
                )}
            </Box>

            {/* IMAGE PREVIEW DIALOG */}
            <Dialog
                open={Boolean(previewImg)}
                onClose={() => setPreviewImg(null)}
                maxWidth="md"
                fullWidth
            >
                <Box sx={{position: 'relative', bgcolor: '#000', p: 0, display: 'flex'}}>
                    <IconButton
                        onClick={() => setPreviewImg(null)}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: '#FFF',
                            bgcolor: 'rgba(0,0,0,0.5)',
                            '&:hover': {bgcolor: 'rgba(0,0,0,0.7)'},
                        }}
                    >
                        <CloseRoundedIcon/>
                    </IconButton>
                    {previewImg && (
                        <Box
                            component="img"
                            src={previewImg}
                            sx={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '90vh',
                                objectFit: 'contain',
                            }}
                        />
                    )}
                </Box>
            </Dialog>
        </Box>
    );
};

export default ParkingSpotDetailsPanel;