import {Box, ButtonBase, Stack, Typography} from '@mui/material';
import AccessibleRoundedIcon from '@mui/icons-material/AccessibleRounded';
import ElectricBoltRoundedIcon from '@mui/icons-material/ElectricBoltRounded';
import type {ParkingSpotStatus, SpaceType} from '@api/types.ts';
import type {SpotOrientation} from './ParkingData';

interface ParkingSpotProps {
    label: string;
    x: number;
    y: number;
    orientation: SpotOrientation;
    status?: ParkingSpotStatus;
    spaceType: SpaceType;
    selected?: boolean;
    onClick: () => void;
}

const DEFAULT_SPOT_COLOR = '#BFC0C5';
const SELECTED_SPOT_COLOR = '#A93BFF';

const getMainColor = (selected?: boolean) => {
    if (selected) return SELECTED_SPOT_COLOR;
    return DEFAULT_SPOT_COLOR;
};

const renderSpaceIcons = (spaceType: SpaceType, color: string) => {
    const showAccessible =
        spaceType === 'REGULAR_HANDICAPED' ||
        spaceType === 'EV_HANDICAPED' ||
        spaceType === 'REGULAR_BOTH' ||
        spaceType === 'EV_BOTH';

    const showEv =
        spaceType === 'EV_ABLEBODIED' ||
        spaceType === 'EV_HANDICAPED' ||
        spaceType === 'EV_BOTH';

    if (!showAccessible && !showEv) return null;

    return (
        <Stack direction="row" spacing={0.45} justifyContent="center">
            {showAccessible && <AccessibleRoundedIcon sx={{fontSize: 18, color}}/>}
            {showEv && <ElectricBoltRoundedIcon sx={{fontSize: 18, color}}/>}
        </Stack>
    );
};

const ParkingSpot = ({
                         label,
                         x,
                         y,
                         orientation,
                         spaceType,
                         selected = false,
                         onClick,
                     }: ParkingSpotProps) => {
    const color = getMainColor(selected);
    const icons = renderSpaceIcons(spaceType, color);

    const isLeft = orientation === 'left';
    const isBottom = orientation === 'bottom';
    const isMiddleTop = orientation === 'middleTop';
    const isMiddleBottom = orientation === 'middleBottom';

    const lineThickness = 5;

    if (isLeft) {
        return (
            <ButtonBase
                onClick={onClick}
                sx={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: 140,
                    height: 62,
                    borderRadius: 1,
                    '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.04)',
                    },
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: lineThickness,
                        height: '100%',
                        bgcolor: color,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: 130,
                        height: lineThickness,
                        bgcolor: color,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: 130,
                        height: lineThickness,
                        bgcolor: color,
                    }}
                />

                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        pl: 1.25,
                        pr: 0.75,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        sx={{
                            color,
                            fontSize: 20,
                            fontWeight: 500,
                            lineHeight: 1,
                            mb: icons ? 0.7 : 0,
                        }}
                    >
                        {label}
                    </Typography>

                    <Box sx={{minHeight: 20, mt: 0.2}}>
                        {icons}
                    </Box>
                </Box>
            </ButtonBase>
        );
    }

    const spotWidth = 80;
    const spotHeight = 136;

    const renderTopOpenSpot = () => (
        <>
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: lineThickness,
                    height: spotHeight,
                    bgcolor: color,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: lineThickness,
                    height: spotHeight,
                    bgcolor: color,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: '100%',
                    height: lineThickness,
                    bgcolor: color,
                }}
            />
        </>
    );

    const renderBottomOpenSpot = () => (
        <>
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: lineThickness,
                    height: spotHeight,
                    bgcolor: color,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    width: lineThickness,
                    height: spotHeight,
                    bgcolor: color,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: lineThickness,
                    bgcolor: color,
                }}
            />
        </>
    );

    return (
        <ButtonBase
            onClick={onClick}
            sx={{
                position: 'absolute',
                left: x,
                top: y,
                width: spotWidth,
                height: spotHeight,
                borderRadius: 1,
                '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.04)',
                },
            }}
        >
            {isMiddleTop || isBottom ? renderTopOpenSpot() : null}
            {isMiddleBottom ? renderBottomOpenSpot() : null}

            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    px: 0.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent:
                        isMiddleTop || isBottom ? 'flex-end' : 'flex-start',
                    pt: isMiddleBottom ? 1.1 : 0,
                    pb: isMiddleTop || isBottom ? 1.1 : 0,
                }}
            >
                <Typography
                    sx={{
                        color,
                        fontSize: 18,
                        fontWeight: 500,
                        lineHeight: 1,
                        mb: icons ? 0.7 : 0,
                    }}
                >
                    {label}
                </Typography>

                <Box sx={{minHeight: 20, mt: 0.2}}>
                    {icons}
                </Box>
            </Box>
        </ButtonBase>
    );
};

export default ParkingSpot;