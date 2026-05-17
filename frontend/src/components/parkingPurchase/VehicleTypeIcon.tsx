import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded';
import ElectricCarRoundedIcon from '@mui/icons-material/ElectricCarRounded';
import AccessibleRoundedIcon from '@mui/icons-material/AccessibleRounded';

type VehicleTypeIconProps = {
    carType: string;
};

const VehicleTypeIcon = ({carType}: VehicleTypeIconProps) => {
    if (carType.includes('HANDICAPED')) {
        return <AccessibleRoundedIcon/>;
    }

    if (carType.includes('EV')) {
        return <ElectricCarRoundedIcon/>;
    }

    return <DirectionsCarRoundedIcon/>;
};

export default VehicleTypeIcon;