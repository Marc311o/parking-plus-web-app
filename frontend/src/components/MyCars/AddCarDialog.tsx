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
import {useState} from 'react';

import type {CarType, VehicleDTO} from '@api/MyCars';

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (vehicle: Omit<VehicleDTO, 'id'>) => Promise<void>;
    ownerId?: number;
}

const CAR_TYPES: CarType[] = [
    'REGULAR_ABLEBODIED',
    'REGULAR_HANDICAPED',
    'EV_ABLEBODIED',
    'EV_HANDICAPED',
];

export default function AddCarDialog({
                                         open,
                                         onClose,
                                         onSubmit,
                                         ownerId,
                                     }: Props) {
    const {formatMessage} = useIntl();

    const [plateError, setPlateError] = useState(false);

    const [licensePlate, setLicensePlate] = useState('');
    const [carType, setCarType] =
        useState<CarType>('REGULAR_ABLEBODIED');

    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setPlateError(false);
        setLicensePlate('');
        setCarType('REGULAR_ABLEBODIED');
        onClose();
    };

    const LICENSE_PLATE_REGEX =
        /^([A-Z]{1,3}) ([0-9]{4,5}|[0-9A-Z]{4,5}|[0-9A-Z]{3,5})$/;

    const isValidLicensePlate = (plate: string): boolean => {
        return LICENSE_PLATE_REGEX.test(plate.trim().toUpperCase());
    };

    const handleSubmit = async () => {
        if (ownerId == null) return;

        const normalizedPlate = licensePlate.trim().toUpperCase();

        if (!isValidLicensePlate(normalizedPlate)) {
            setPlateError(true);
            return;
        }

        setPlateError(false);


        try {
            setLoading(true);

            await onSubmit({
                licensePlate: normalizedPlate,
                ownerId,
                carType,
            });

            setLicensePlate('');
            setCarType('REGULAR_ABLEBODIED');
            handleClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="xs"
        >
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
                        <DirectionsCarRoundedIcon />
                    </Avatar>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: 18,
                                fontWeight: 800,
                            }}
                        >
                            {formatMessage({
                                id: 'myCars.addDialog.title',
                            })}
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent
                sx={{
                    bgcolor: '#FBF7FC',
                    pt: '24px !important',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >

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
                        onChange={(e) =>
                            setLicensePlate(e.target.value)
                        }
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
                                <MenuItem
                                    key={type}
                                    value={type}
                                >
                                    {formatMessage({
                                        id: `myCars.carTypes.${type}`,
                                    })}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3,
                    bgcolor: '#FBF7FC',
                }}
            >
                <Button
                    onClick={onClose}
                    color="inherit"
                >
                    {formatMessage({
                        id: 'myCars.fields.cancel',
                    })}
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                        loading ||
                        !licensePlate.trim() ||
                        ownerId == null
                    }
                >
                    {formatMessage({
                        id: 'myCars.addCar',
                    })}
                </Button>
            </DialogActions>
        </Dialog>
    );
}