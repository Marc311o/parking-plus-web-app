import {useMemo, useState} from 'react';
import {Box} from '@mui/material';
import type {ParkingLevel} from '@api/types.ts';
import ParkingSpot from './ParkingSpot';
import ParkingLevelSwitch from './ParkingLevelSwitch';
import {
    mockParkingSpotsByLevel,
    parkingLayoutByLevel,
} from './ParkingData';

const ParkingMap = () => {
    const [activeLevel, setActiveLevel] = useState<ParkingLevel>('A');
    const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

    const spotsFromBackend = mockParkingSpotsByLevel[activeLevel];

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

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                minHeight: 620,
                display: 'flex',
                overflow: 'hidden',
                borderRadius: 2,
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    position: 'relative',
                    minWidth: 0,
                    minHeight: 620,
                    bgcolor: '#232328',
                    borderTopLeftRadius: 16,
                    borderBottomLeftRadius: 16,
                    overflow: 'hidden',
                }}
            >
                {/* lewy blok */}
                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        top: 330,
                        width: 20,
                        height: 150,
                        bgcolor: '#2C2C33',
                    }}
                />

                {/* prawy blok */}
                <Box
                    sx={{
                        position: 'absolute',
                        right: 28,
                        top: 50,
                        width: 110,
                        height: 340,
                        bgcolor: '#2C2C33',
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
                        onClick={() => setSelectedSpotId(spot.id)}
                    />
                ))}
            </Box>

            <ParkingLevelSwitch
                value={activeLevel}
                onChange={(level) => {
                    setActiveLevel(level);
                    setSelectedSpotId(null);
                }}
            />
        </Box>
    );
};

export default ParkingMap;