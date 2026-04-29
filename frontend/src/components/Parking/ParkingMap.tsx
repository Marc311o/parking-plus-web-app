import {useMemo, useState} from 'react';
import {Box} from '@mui/material';
import type {ParkingLevel, ParkingSpotDetails} from '@api/types';
import ParkingSpot from './ParkingSpot';
import ParkingLevelSwitch from './ParkingLevelSwitch';
import ParkingSpotDetailsPanel from './ParkingSpotDetailsPanel';
import {
    mockParkingSpotsByLevel,
    parkingLayoutByLevel,
} from './ParkingData';
import {mockParkingSpotDetailsById} from '../../mocks/mockParkingSpotDetails';

type ParkingMapVariant = 'dashboard' | 'statistics';

type ParkingMapProps = {
    variant?: ParkingMapVariant;
    interactive?: boolean;
    showDetailsPanel?: boolean;
    onSpotSelect?: (spotId: string | null) => void;
    onLevelChange?: (level: ParkingLevel) => void;
};

export const ParkingMap = ({
                               variant = 'dashboard',
                               interactive = true,
                               showDetailsPanel = true,
                               onSpotSelect,
                               onLevelChange,
                           }: ParkingMapProps) => {
    const [activeLevel, setActiveLevel] = useState<ParkingLevel>('A');
    const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

    const isStatisticsVariant = variant === 'statistics';

    const spotsFromBackend = mockParkingSpotsByLevel[activeLevel];

    const selectedSpotDetails: ParkingSpotDetails | null = selectedSpotId
        ? mockParkingSpotDetailsById[selectedSpotId] ?? null
        : null;

    const mappedSpots = useMemo(() => {
        const layout = parkingLayoutByLevel[activeLevel];

        return layout.map((layoutSpot) => {
            const spot = spotsFromBackend.find((item) => item.id === layoutSpot.id);

            return {
                ...layoutSpot,
                id: spot?.id ?? layoutSpot.id,
                label: spot?.label ?? layoutSpot.id,
                status: spot?.status,
                spaceType: spot?.spaceType ?? 'REGULAR_ABLEBODIED',
            };
        });
    }, [activeLevel, spotsFromBackend]);

    const handleSpotClick = (spotId: string) => {
        if (!interactive) {
            return;
        }

        setSelectedSpotId(spotId);
        onSpotSelect?.(spotId);
    };

    const handleLevelChange = (level: ParkingLevel) => {
        setActiveLevel(level);
        setSelectedSpotId(null);
        onSpotSelect?.(null);
        onLevelChange?.(level);
    };

    return (
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    minHeight: 620,
                    display: 'flex',
                    borderRadius: 2,
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        position: 'relative',
                        minWidth: 0,
                        minHeight: 620,
                        bgcolor: isStatisticsVariant ? '#FFFFFF' : '#232328',
                        border: isStatisticsVariant ? '6px solid #8E24AA' : 'none',
                        borderRight: 'none',
                        borderTopLeftRadius: 16,
                        borderBottomLeftRadius: 16,
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 0,
                            top: 330,
                            width: 20,
                            height: 150,
                            bgcolor: isStatisticsVariant ? '#E5C9EA' : '#2C2C33',
                        }}
                    />

                    <Box
                        sx={{
                            position: 'absolute',
                            right: 20,
                            top: 54,
                            width: 96,
                            height: 320,
                            bgcolor: isStatisticsVariant ? '#E5C9EA' : '#2C2C33',
                        }}
                    />

                    {mappedSpots.map((spot) => (
                        <ParkingSpot
                            key={spot.id}
                            label={spot.label}
                            x={spot.x}
                            y={spot.y}
                            orientation={spot.orientation}
                            status={spot.status}
                            spaceType={spot.spaceType}
                            selected={selectedSpotId === spot.id}
                            variant={variant}
                            interactive={interactive}
                            onClick={() => handleSpotClick(spot.id)}
                        />
                    ))}
                </Box>

                <ParkingLevelSwitch
                    value={activeLevel}
                    variant={variant}
                    onChange={handleLevelChange}
                />
            </Box>

            {interactive && showDetailsPanel && (
                <ParkingSpotDetailsPanel details={selectedSpotDetails}/>
            )}
        </Box>
    );
};

export default ParkingMap;