import {Avatar, Button, Paper, Typography} from '@mui/material';
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {useIntl} from 'react-intl';

type ParkingPurchaseEmptyStateProps = {
    onAddVehicle: () => void;
};

const ParkingPurchaseEmptyState = ({onAddVehicle}: ParkingPurchaseEmptyStateProps) => {
    const {formatMessage} = useIntl();

    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                borderRadius: '20px',
                bgcolor: '#FFFFFF',
                border: '1px dashed rgba(139, 31, 158, 0.28)',
                textAlign: 'center',
            }}
        >
            <Avatar
                sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'rgba(193, 59, 219, 0.1)',
                    color: '#8B1F9E',
                }}
            >
                <DirectionsCarRoundedIcon/>
            </Avatar>

            <Typography sx={{fontSize: 20, fontWeight: 900, color: '#202020'}}>
                {formatMessage({id: 'parkingPurchase.noVehiclesTitle'})}
            </Typography>

            <Typography sx={{fontSize: 14, color: '#777777', mt: 1, mb: 2.5}}>
                {formatMessage({id: 'parkingPurchase.noVehiclesDescription'})}
            </Typography>

            <Button
                variant="contained"
                startIcon={<AddRoundedIcon/>}
                onClick={onAddVehicle}
                sx={{
                    height: 42,
                    px: 2.4,
                    borderRadius: '13px',
                    bgcolor: '#9C13B8',
                    textTransform: 'none',
                    fontWeight: 800,
                    boxShadow: 'none',
                    '&:hover': {
                        bgcolor: '#7F0F96',
                        boxShadow: 'none',
                    },
                }}
            >
                {formatMessage({id: 'parkingPurchase.addVehicle'})}
            </Button>
        </Paper>
    );
};

export default ParkingPurchaseEmptyState;