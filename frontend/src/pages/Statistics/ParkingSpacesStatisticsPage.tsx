import {useEffect, useState} from 'react';
import {Box, Paper, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import type {ParkingLevel} from '@api/Dashboard/types';
import {getParkingSpaceTimeline} from '@api/Statistics';
import type {ParkingSpaceTimelineResponse} from '@api/Statistics';
import {ParkingMap} from '@components/Parking';
import {
    ParkingSpaceTimeline,
} from '@components/Statistics';

const toIsoDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const ParkingSpacesStatisticsPage = () => {
    const {formatMessage} = useIntl();

    const [selectedDate, setSelectedDate] = useState(toIsoDate(new Date()));
    const [selectedLevel, setSelectedLevel] = useState<ParkingLevel>('A');
    const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
    const [timelineData, setTimelineData] =
        useState<ParkingSpaceTimelineResponse | null>(null);
    const [isTimelineLoading, setIsTimelineLoading] = useState(false);

    useEffect(() => {
        if (!selectedSpaceId) {
            setTimelineData(null);
            return;
        }

        let isMounted = true;

        const fetchSpaceTimeline = async () => {
            setIsTimelineLoading(true);

            try {
                const data = await getParkingSpaceTimeline(
                    selectedSpaceId,
                    selectedDate
                );

                if (!isMounted) {
                    return;
                }

                setTimelineData(data);
            } catch (error) {
                console.error('Failed to fetch parking space timeline:', error);

                if (isMounted) {
                    setTimelineData(null);
                }
            } finally {
                if (isMounted) {
                    setIsTimelineLoading(false);
                }
            }
        };

        void fetchSpaceTimeline();

        return () => {
            isMounted = false;
        };
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
                <Box
                    sx={{
                        opacity: isTimelineLoading ? 0.7 : 1,
                    }}
                >
                    <ParkingSpaceTimeline
                        data={timelineData}
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                    />
                </Box>
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
                        {selectedSpaceId && isTimelineLoading
                            ? 'Ładowanie danych miejsca...'
                            : formatMessage({id: 'statistics.parkingSpaces.noSpaceSelectedTitle'})}
                    </Typography>

                    <Typography
                        sx={{
                            color: '#8D87AA',
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                    >
                        {selectedSpaceId && isTimelineLoading
                            ? 'Pobieram oś czasu dla wybranego miejsca parkingowego.'
                            : formatMessage({id: 'statistics.parkingSpaces.noSpaceSelectedDescription'})}
                    </Typography>
                </Paper>
            )}
        </Box>
    );
};

export default ParkingSpacesStatisticsPage;