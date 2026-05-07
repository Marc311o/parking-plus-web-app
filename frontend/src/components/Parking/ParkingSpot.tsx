import {Box, ButtonBase, Stack, Typography} from '@mui/material';
import AccessibleRoundedIcon from '@mui/icons-material/AccessibleRounded';
import ElectricBoltRoundedIcon from '@mui/icons-material/ElectricBoltRounded';
import type {ParkingSpotStatus, SpaceType} from '@api/Dashboard/types.ts';
import type {SpotOrientation} from './ParkingData';

type ParkingSpotVariant = 'dashboard' | 'statistics';

interface ParkingSpotProps {
    label: string;
    x: number;
    y: number;
    orientation: SpotOrientation;
    status?: ParkingSpotStatus;
    spaceType: SpaceType;
    selected?: boolean;
    variant?: ParkingSpotVariant;
    interactive?: boolean;
    onClick: () => void;
}

const DASHBOARD_SPOT_COLOR = '#BFC0C5';
const DASHBOARD_OCCUPIED_COLOR = '#E53935';
const DASHBOARD_RESERVED_COLOR = '#FB8C00';

const STATISTICS_SPOT_COLOR = '#8E24AA';
const SELECTED_SPOT_COLOR = '#A93BFF';

const getMainColor = (
    variant: ParkingSpotVariant,
    status?: ParkingSpotStatus,
    selected?: boolean
) => {
    if (selected) {
        return SELECTED_SPOT_COLOR;
    }

    if (variant === 'statistics') {
        return STATISTICS_SPOT_COLOR;
    }

    switch (status) {
        case 'occupied':
            return DASHBOARD_OCCUPIED_COLOR;
        case 'reserved':
            return DASHBOARD_RESERVED_COLOR;
        case 'available':
        default:
            return DASHBOARD_SPOT_COLOR;
    }
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
                         status,
                         spaceType,
                         selected = false,
                         variant = 'dashboard',
                         interactive = true,
                         onClick,
                     }: ParkingSpotProps) => {
    const color = getMainColor(variant, status, selected);
    const icons = renderSpaceIcons(spaceType, color);

    const isLeft = orientation === 'left';
    const isBottom = orientation === 'bottom';
    const isMiddleTop = orientation === 'middleTop';
    const isMiddleBottom = orientation === 'middleBottom';

    const lineThickness = 5;

    const handleClick = () => {
        if (!interactive) {
            return;
        }

        onClick();
    };

    const hoverBackground =
        variant === 'statistics'
            ? 'rgba(142, 36, 170, 0.06)'
            : 'rgba(255,255,255,0.04)';

    if (isLeft) {
        return (
            <ButtonBase
                onClick={handleClick}
                disableRipple={!interactive}
                sx={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: 140,
                    height: 62,
                    borderRadius: 1,
                    cursor: interactive ? 'pointer' : 'default',
                    '&:hover': {
                        bgcolor: interactive ? hoverBackground : 'transparent',
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
            onClick={handleClick}
            disableRipple={!interactive}
            sx={{
                position: 'absolute',
                left: x,
                top: y,
                width: spotWidth,
                height: spotHeight,
                borderRadius: 1,
                cursor: interactive ? 'pointer' : 'default',
                '&:hover': {
                    bgcolor: interactive ? hoverBackground : 'transparent',
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