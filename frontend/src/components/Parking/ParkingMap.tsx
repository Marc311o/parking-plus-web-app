import {useEffect, useMemo, useState} from 'react';
import {Box} from '@mui/material';
import type {
    ParkingLevel,
    ParkingSpaceDto,
    ParkingSpaceStatus,
    ParkingSpotDetails,
} from '@api/Dashboard/types';
import {getParkingSpacesByLevel, getParkingSpotDetails} from '@api/Dashboard/parkingSpaces';
import ParkingSpot from './ParkingSpot';
import ParkingLevelSwitch from './ParkingLevelSwitch';
import ParkingSpotDetailsPanel from './ParkingSpotDetailsPanel';
import {parkingLayoutByLevel} from './ParkingData';

type ParkingMapVariant = 'dashboard' | 'statistics';

type ParkingMapProps = {
    variant?: ParkingMapVariant;
    interactive?: boolean;
    showDetailsPanel?: boolean;
    onSpotSelect?: (spotId: string | null) => void;
    onLevelChange?: (level: ParkingLevel) => void;
};

type ParkingSpotUiStatus = 'available' | 'occupied' | 'reserved';

const levelToBackendLevel = (level: ParkingLevel): number => {
    switch (level) {
        case 'A':
            return 0;
        case 'B':
            return 1;
        default:
            return 0;
    }
};

const mapStatusToUiStatus = (status?: ParkingSpaceStatus): ParkingSpotUiStatus => {
    switch (status) {
        case 'OCCUPIED':
            return 'occupied';
        case 'RESERVED':
            return 'reserved';
        case 'FREE':
        default:
            return 'available';
    }
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

    const [parkingSpaces, setParkingSpaces] = useState<ParkingSpaceDto[]>([]);
    const [selectedSpotDetails, setSelectedSpotDetails] = useState<ParkingSpotDetails | null>(null);

    const [isParkingSpacesLoading, setIsParkingSpacesLoading] = useState(false);
    const [isDetailsLoading, setIsDetailsLoading] = useState(false);

    const isStatisticsVariant = variant === 'statistics';

    useEffect(() => {
        let isMounted = true;

        const fetchParkingSpaces = async () => {
            setIsParkingSpacesLoading(true);

            try {
                const backendLevel = levelToBackendLevel(activeLevel);
                const result = await getParkingSpacesByLevel(backendLevel);
                if (!isMounted) {
                    return;
                }

                setParkingSpaces(result);
            } catch (error) {
                console.error('Failed to fetch parking spaces:', error);

                if (isMounted) {
                    setParkingSpaces([]);
                }
            } finally {
                if (isMounted) {
                    setIsParkingSpacesLoading(false);
                }
            }
        };

        void fetchParkingSpaces();

        return () => {
            isMounted = false;
        };
    }, [activeLevel]);

    useEffect(() => {
        if (!selectedSpotId || !interactive || !showDetailsPanel) {
            setSelectedSpotDetails(null);
            return;
        }

        let isMounted = true;

        const fetchSpotDetails = async () => {
            setIsDetailsLoading(true);

            try {
                const result = await getParkingSpotDetails(selectedSpotId);

                if (!isMounted) {
                    return;
                }

                setSelectedSpotDetails(result);
            } catch (error) {
                console.error('Failed to fetch parking spot details:', error);

                if (isMounted) {
                    setSelectedSpotDetails(null);
                }
            } finally {
                if (isMounted) {
                    setIsDetailsLoading(false);
                }
            }
        };

        void fetchSpotDetails();

        return () => {
            isMounted = false;
        };
    }, [selectedSpotId, interactive, showDetailsPanel]);

    const mappedSpots = useMemo(() => {
        const layout = parkingLayoutByLevel[activeLevel];

        return layout.map((layoutSpot) => {
            const spot = parkingSpaces.find((item) => item.id === layoutSpot.id);

            return {
                ...layoutSpot,
                id: spot?.id ?? layoutSpot.id,
                label: spot?.id ?? layoutSpot.id,
                status: mapStatusToUiStatus(spot?.status),
                spaceType: spot?.spaceType ?? 'REGULAR_ABLEBODIED',
            };
        });
    }, [activeLevel, parkingSpaces]);

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
        setSelectedSpotDetails(null);
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
                opacity: isParkingSpacesLoading ? 0.7 : 1,
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

            {interactive && showDetailsPanel && !isDetailsLoading && (
                <ParkingSpotDetailsPanel details={selectedSpotDetails}/>
            )}
        </Box>
    );
};

export default ParkingMap;