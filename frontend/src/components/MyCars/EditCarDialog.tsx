import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    IconButton,
    Avatar,
    Alert,
} from '@mui/material';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';

import {useIntl} from 'react-intl';
import {useEffect, useState} from 'react';

import type {CarType, VehicleDTO} from '@api/MyCars';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (id: string, vehicle: Omit<VehicleDTO, 'id'>) => Promise<void>;
    vehicle: VehicleDTO | null;
}

const CAR_TYPES: CarType[] = [
    'REGULAR_ABLEBODIED',
    'REGULAR_HANDICAPED',
    'EV_ABLEBODIED',
    'EV_HANDICAPED',
];

const LICENSE_PLATE_REGEX =
    /^([A-Z]{1,3}) ([0-9]{4,5}|[0-9A-Z]{4,5}|[0-9A-Z]{3,5})$/;

const isValidLicensePlate = (plate: string): boolean => {
    return LICENSE_PLATE_REGEX.test(plate.trim().toUpperCase());
};

export default function EditCarDialog({
                                          open,
                                          onClose,
                                          onSubmit,
                                          vehicle,
                                      }: Props) {
    const {formatMessage} = useIntl();

    const [licensePlate, setLicensePlate] = useState('');
    const [carType, setCarType] = useState<CarType>('REGULAR_ABLEBODIED');

    const [loading, setLoading] = useState(false);
    const [plateError, setPlateError] = useState(false);

    useEffect(() => {
        if (vehicle) {
            setLicensePlate(vehicle.licensePlate);
            setCarType(vehicle.carType);
            setPlateError(false);
        }
    }, [vehicle]);

    const handleClose = () => {
        setPlateError(false);
        setLicensePlate('');
        setCarType('REGULAR_ABLEBODIED');
        onClose();
    };

    const handleSubmit = async () => {
        if (!vehicle) return;

        const normalizedPlate = licensePlate.trim().toUpperCase();

        if (!isValidLicensePlate(normalizedPlate)) {
            setPlateError(true);
            return;
        }

        setPlateError(false);

        try {
            setLoading(true);

            await onSubmit(vehicle.id, {
                licensePlate: normalizedPlate,
                carType,
                ownerId: vehicle.ownerId,
            } as any);

            handleClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">

            <IconButton
                onClick={handleClose}
                disableRipple
                sx={{
                    position: 'absolute',
                    top: 22,
                    right: 0,
                    zIndex: 2,
                    color: '#FFFFFF',
                    p: 0,
                    '&:hover': { bgcolor: 'transparent', opacity: 0.75 },
                }}
            >
                <CloseRoundedIcon />
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
                        <DirectionsCarRoundedIcon />
                    </Avatar>

                    <Typography sx={{ fontSize: 18, fontWeight: 800 }}>
                        {formatMessage({ id: 'myCars.editDialog.title' })}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ bgcolor: '#FBF7FC', pt: '24px !important' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                    {plateError && (
                        <Alert severity="error" sx={{ width: '100%' }}>
                            {formatMessage({
                                id: 'myCars.addDialog.licensePlateFormatError',
                            })}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label={formatMessage({
                            id: 'myCars.fields.licensePlate',
                        })}
                        value={licensePlate}
                        onChange={(e) => {
                            setLicensePlate(e.target.value);
                            setPlateError(false);
                        }}
                        error={plateError}
                    />

                    <FormControl fullWidth>
                        <InputLabel>
                            {formatMessage({
                                id: 'myCars.fields.carType',
                            })}
                        </InputLabel>

                        <Select
                            value={carType}
                            label={formatMessage({
                                id: 'myCars.fields.carType',
                            })}
                            onChange={(e) =>
                                setCarType(e.target.value as CarType)
                            }
                        >
                            {CAR_TYPES.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {formatMessage({
                                        id: `myCars.carTypes.${type}`,
                                    })}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, bgcolor: '#FBF7FC' }}>
                <Button onClick={handleClose} color="inherit">
                    {formatMessage({ id: 'myCars.fields.cancel' })}
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading || !licensePlate.trim() || !vehicle}
                >
                    {formatMessage({ id: 'myCars.fields.update' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
}