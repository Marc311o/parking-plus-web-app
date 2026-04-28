import {useEffect, useState} from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import type {ParkingLevel} from '@api/types';
import {ParkingMap} from '@components/Parking';
import {
    ParkingSpaceTimeline,
    type ParkingSpaceTimelineResponse,
} from '@components/Statistics';

const toIsoDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const createMockSpaceTimeline = (
    spaceId: string,
    date: string
): ParkingSpaceTimelineResponse => {
    return {
        spaceId,
        date,
        items: [
            {
                status: 'OCCUPIED',
                from: '07:10',
                to: '09:25',
            },
            {
                status: 'RESERVED',
                from: '19:05',
                to: '20:55',
            },
        ],
    };
};

const ParkingSpacesStatisticsPage = () => {
    const {formatMessage} = useIntl();

    const [selectedDate, setSelectedDate] = useState(toIsoDate(new Date()));
    const [selectedLevel, setSelectedLevel] = useState<ParkingLevel>('A');
    const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
    const [timelineData, setTimelineData] =
        useState<ParkingSpaceTimelineResponse | null>(null);

    useEffect(() => {
        if (!selectedSpaceId) {
            setTimelineData(null);
            return;
        }

        // TUTAJ BĘDZIE FETCH DO BACKENDU:
        //
        // const fetchSpaceTimeline = async () => {
        //     try {
        //         const response = await fetch(
        //             `/api/statistics/parking/spaces/${selectedSpaceId}/timeline?date=${selectedDate}`
        //         );
        //
        //         if (!response.ok) {
        //             throw new Error('Failed to fetch parking space timeline');
        //         }
        //
        //         const data: ParkingSpaceTimelineResponse = await response.json();
        //
        //         setTimelineData(data);
        //     } catch (error) {
        //         console.error(error);
        //         setTimelineData(createMockSpaceTimeline(selectedSpaceId, selectedDate));
        //     }
        // };
        //
        // fetchSpaceTimeline();

        setTimelineData(createMockSpaceTimeline(selectedSpaceId, selectedDate));
    }, [selectedSpaceId, selectedDate]);

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    minHeight: 640,
                    display: 'flex',
                }}
            >
                <ParkingMap
                    variant="statistics"
                    interactive
                    showDetailsPanel={false}
                    onSpotSelect={setSelectedSpaceId}
                    onLevelChange={(level) => {
                        setSelectedLevel(level);
                        setSelectedSpaceId(null);
                        setTimelineData(null);
                    }}
                />
            </Box>
            {selectedSpaceId && timelineData ? (
                <ParkingSpaceTimeline
                    data={timelineData}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />
            ) : (
                <Paper
                    elevation={0}
                    sx={{
                        width: '100%',
                        borderRadius: '22px',
                        bgcolor: '#FFFFFF',
                        border: '1px solid #F0EEF7',
                        boxShadow: '0 14px 36px rgba(19, 16, 48, 0.06)',
                        p: 3,
                    }}
                >
                    <Typography
                        sx={{
                            color: '#8E24AA',
                            fontSize: 20,
                            fontWeight: 900,
                            mb: 0.6,
                        }}
                    >
                        {formatMessage({id: 'statistics.parkingSpaces.noSpaceSelectedTitle'})}
                    </Typography>

                    <Typography
                        sx={{
                            color: '#8D87AA',
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                    >
                        {formatMessage({id: 'statistics.parkingSpaces.noSpaceSelectedDescription'})}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default ParkingSpacesStatisticsPage;