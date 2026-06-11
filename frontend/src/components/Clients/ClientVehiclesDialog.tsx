import {
    Avatar,
    Box,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import ElectricCarRoundedIcon from '@mui/icons-material/ElectricCarRounded';
import AccessibleRoundedIcon from '@mui/icons-material/AccessibleRounded';
import ConfirmationNumberRoundedIcon from '@mui/icons-material/ConfirmationNumberRounded';
import {useIntl} from 'react-intl';

import type {ClientDTO, VehicleDTO} from '@api/Clients';

interface ClientVehiclesDialogProps {
    open: boolean;
    client: ClientDTO | null;
    vehicles: VehicleDTO[];
    isLoading: boolean;
    error: string | null;
    onClose: () => void;
}

const getVehicleIcon = (carType: VehicleDTO['carType']) => {
    if (carType.includes('HANDICAPED')) {
        return <AccessibleRoundedIcon/>;
    }

    if (carType.includes('EV')) {
        return <ElectricCarRoundedIcon/>;
    }

    return <DirectionsCarRoundedIcon/>;
};

export default function ClientVehiclesDialog({
                                                 open,
                                                 client,
                                                 vehicles,
                                                 isLoading,
                                                 error,
                                                 onClose,
                                             }: ClientVehiclesDialogProps) {
    const {formatMessage} = useIntl();

    const getCarTypeLabel = (carType: VehicleDTO['carType']) => {
        return formatMessage({id: `clients.vehiclesDialog.carTypes.${carType}`});
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
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
                        minWidth: 0,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 48,
                            height: 48,
                            bgcolor: 'rgba(255,255,255,0.18)',
                            color: '#FFFFFF',
                            border: '1px solid rgba(255,255,255,0.28)',
                        }}
                    >
                        <DirectionsCarRoundedIcon/>
                    </Avatar>

                    <Box sx={{minWidth: 0}}>
                        <Typography sx={{fontSize: 20, fontWeight: 800, lineHeight: 1.2}}>
                            {formatMessage({id: 'clients.vehiclesDialog.title'})}
                        </Typography>

                        <Typography sx={{fontSize: 13, opacity: 0.86, mt: 0.5}} noWrap>
                            {client ? `${client.name} ${client.surname}` : ''}
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent sx={{p: 0, bgcolor: '#FBF7FC'}}>
                <Box sx={{p: 3}}>
                    {isLoading && (
                        <Box
                            sx={{
                                py: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <CircularProgress size={34}/>
                            <Typography sx={{fontSize: 14, color: '#777777'}}>
                                {formatMessage({id: 'clients.vehiclesDialog.loading'})}
                            </Typography>
                        </Box>
                    )}

                    {!isLoading && error && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 3,
                                borderRadius: '18px',
                                textAlign: 'center',
                                color: '#8B1F9E',
                                bgcolor: '#FFFFFF',
                                border: '1px solid rgba(193, 59, 219, 0.16)',
                            }}
                        >
                            <Typography sx={{fontWeight: 700}}>
                                {error}
                            </Typography>
                        </Paper>
                    )}

                    {!isLoading && !error && vehicles.length === 0 && (
                        <Paper
                            elevation={0}
                            sx={{
                                p: 4,
                                borderRadius: '18px',
                                textAlign: 'center',
                                bgcolor: '#FFFFFF',
                                border: '1px dashed rgba(139, 31, 158, 0.25)',
                            }}
                        >
                            <Avatar
                                sx={{
                                    mx: 'auto',
                                    mb: 1.5,
                                    width: 54,
                                    height: 54,
                                    bgcolor: 'rgba(193, 59, 219, 0.1)',
                                    color: '#8B1F9E',
                                }}
                            >
                                <DirectionsCarRoundedIcon/>
                            </Avatar>

                            <Typography sx={{fontWeight: 800, color: '#252525'}}>
                                {formatMessage({id: 'clients.vehiclesDialog.emptyTitle'})}
                            </Typography>

                            <Typography sx={{fontSize: 14, color: '#858585', mt: 0.5}}>
                                {formatMessage({id: 'clients.vehiclesDialog.emptyDescription'})}
                            </Typography>
                        </Paper>
                    )}

                    {!isLoading && !error && vehicles.length > 0 && (
                        <Stack spacing={1.5}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: 13,
                                        fontWeight: 800,
                                        color: '#8B1F9E',
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.6,
                                    }}
                                >
                                    {formatMessage(
                                        {id: 'clients.vehiclesDialog.vehiclesCount'},
                                        {count: vehicles.length},
                                    )}
                                </Typography>
                            </Box>

                            {vehicles.map((vehicle) => (
                                <Paper
                                    key={vehicle.id ?? vehicle.licensePlate}
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        borderRadius: '18px',
                                        bgcolor: '#FFFFFF',
                                        border: '1px solid rgba(139, 31, 158, 0.09)',
                                        boxShadow: '0 12px 30px rgba(20, 30, 55, 0.06)',
                                    }}
                                >
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                        <Avatar
                                            sx={{
                                                width: 46,
                                                height: 46,
                                                bgcolor: 'rgba(193, 59, 219, 0.1)',
                                                color: '#8B1F9E',
                                            }}
                                        >
                                            {getVehicleIcon(vehicle.carType)}
                                        </Avatar>

                                        <Box sx={{flex: 1, minWidth: 0}}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    flexWrap: 'wrap',
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        fontSize: 18,
                                                        fontWeight: 900,
                                                        color: '#202020',
                                                        letterSpacing: 0.7,
                                                    }}
                                                >
                                                    {vehicle.licensePlate}
                                                </Typography>

                                                <Chip
                                                    size="small"
                                                    label={getCarTypeLabel(vehicle.carType)}
                                                    sx={{
                                                        height: 24,
                                                        borderRadius: '8px',
                                                        fontSize: 11,
                                                        fontWeight: 800,
                                                        color: '#8B1F9E',
                                                        bgcolor: 'rgba(193, 59, 219, 0.1)',
                                                    }}
                                                />
                                            </Box>

                                            {/*<Divider sx={{my: 1.2}}/>*/}

                                            {/*<Box*/}
                                            {/*    sx={{*/}
                                            {/*        display: 'flex',*/}
                                            {/*        alignItems: 'center',*/}
                                            {/*        gap: 0.8,*/}
                                            {/*        color: '#777777',*/}
                                            {/*    }}*/}
                                            {/*>*/}
                                            {/*    <ConfirmationNumberRoundedIcon sx={{fontSize: 17}}/>*/}
                                            {/*    <Typography sx={{fontSize: 13, fontWeight: 600}}>*/}
                                            {/*        {formatMessage(*/}
                                            {/*            {id: 'clients.vehiclesDialog.vehicleId'},*/}
                                            {/*            {id: vehicle.id ?? '-'},*/}
                                            {/*        )}*/}
                                            {/*    </Typography>*/}
                                            {/*</Box>*/}
                                        </Box>
                                    </Box>
                                </Paper>
                            ))}
                        </Stack>
                    )}
                </Box>
            </DialogContent>
        </Dialog>
    );
}