import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography,
} from '@mui/material';
import {useIntl} from 'react-intl';
import type {VehicleDTO} from '@api/ParkingPurchase';
import VehicleTypeIcon from './VehicleTypeIcon';

type ParkingPurchaseVehicleCardProps = {
    vehicles: VehicleDTO[];
    selectedVehicle: VehicleDTO | null;
    selectedVehicleId: string;
    isDisabled: boolean;
    onVehicleChange: (vehicleId: string) => void;
};

const ParkingPurchaseVehicleCard = ({
                                        vehicles,
                                        selectedVehicle,
                                        selectedVehicleId,
                                        isDisabled,
                                        onVehicleChange,
                                    }: ParkingPurchaseVehicleCardProps) => {
    const {formatMessage} = useIntl();

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
                        {formatMessage({id: 'parkingPurchase.vehicleSectionTitle'})}
                    </Typography>

                    <Typography sx={{fontSize: 13, color: '#777777', mt: 0.4}}>
                        {formatMessage({id: 'parkingPurchase.vehicleSectionDescription'})}
                    </Typography>
                </Box>

                <FormControl fullWidth>
                    <InputLabel>{formatMessage({id: 'parkingPurchase.vehicleLabel'})}</InputLabel>

                    <Select
                        label={formatMessage({id: 'parkingPurchase.vehicleLabel'})}
                        value={selectedVehicleId}
                        onChange={(event) => onVehicleChange(event.target.value)}
                        disabled={isDisabled}
                        sx={{
                            borderRadius: '14px',
                            bgcolor: '#FFFFFF',
                        }}
                    >
                        {vehicles.map((vehicle) => (
                            <MenuItem
                                key={vehicle.id ?? vehicle.licensePlate}
                                value={String(vehicle.id)}
                                disabled={!vehicle.id}
                            >
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <VehicleTypeIcon carType={vehicle.carType}/>
                                    <span>{vehicle.licensePlate}</span>
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {selectedVehicle && (
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: '18px',
                            bgcolor: '#FBF7FC',
                            border: '1px solid rgba(139, 31, 158, 0.09)',
                        }}
                    >
                        <CardContent sx={{p: 2.5}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                <Avatar
                                    sx={{
                                        width: 50,
                                        height: 50,
                                        bgcolor: 'rgba(193, 59, 219, 0.1)',
                                        color: '#8B1F9E',
                                    }}
                                >
                                    <VehicleTypeIcon carType={selectedVehicle.carType}/>
                                </Avatar>

                                <Box sx={{flex: 1, minWidth: 0}}>
                                    <Typography
                                        sx={{
                                            fontSize: 20,
                                            fontWeight: 900,
                                            color: '#202020',
                                            letterSpacing: 0.8,
                                        }}
                                    >
                                        {selectedVehicle.licensePlate}
                                    </Typography>

                                    <Chip
                                        size="small"
                                        label={selectedVehicle.carType}
                                        sx={{
                                            mt: 0.8,
                                            height: 24,
                                            borderRadius: '8px',
                                            fontSize: 11,
                                            fontWeight: 800,
                                            color: '#8B1F9E',
                                            bgcolor: 'rgba(193, 59, 219, 0.1)',
                                        }}
                                    />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Stack>
        </Paper>
    );
};

export default ParkingPurchaseVehicleCard;