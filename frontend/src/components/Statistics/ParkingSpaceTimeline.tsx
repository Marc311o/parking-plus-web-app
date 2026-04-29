import {Box, Paper, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import {StatisticsDatePicker} from './StatisticsDatePicker';

export type ParkingSpaceTimelineStatus = 'OCCUPIED' | 'RESERVED';

export type ParkingSpaceTimelineItem = {
    status: ParkingSpaceTimelineStatus;
    from: string;
    to: string;
};

export type ParkingSpaceTimelineResponse = {
    spaceId: string;
    date: string;
    items: ParkingSpaceTimelineItem[];
};

type ParkingSpaceTimelineProps = {
    data: ParkingSpaceTimelineResponse;
    selectedDate: string;
    onDateChange: (date: string) => void;
};

const getMinutesFromTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);

    return hours * 60 + minutes;
};

const formatDate = (date: string) => {
    const [year, month, day] = date.split('-');

    return `${day}.${month}.${year}`;
};

export const ParkingSpaceTimeline = ({
                                         data,
                                         selectedDate,
                                         onDateChange,
                                     }: ParkingSpaceTimelineProps) => {
    const {formatMessage} = useIntl();

    const hours = Array.from({length: 25}, (_, index) => index);
    const dayMinutes = 24 * 60;

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                borderRadius: '22px',
                bgcolor: '#FFFFFF',
                border: '1px solid #F0EEF7',
                boxShadow: '0 14px 36px rgba(19, 16, 48, 0.08)',
                p: {
                    xs: 2.4,
                    md: 3,
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: {
                        xs: 'flex-start',
                        md: 'center',
                    },
                    gap: 2,
                    flexDirection: {
                        xs: 'column',
                        md: 'row',
                    },
                    mb: 2.5,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            color: '#8E24AA',
                            fontSize: {
                                xs: 20,
                                md: 24,
                            },
                            fontWeight: 900,
                            lineHeight: 1.1,
                        }}
                    >
                        {data.spaceId} — {formatDate(data.date)}
                    </Typography>

                    <Typography
                        sx={{
                            color: '#8D87AA',
                            fontSize: 13,
                            fontWeight: 700,
                            mt: 0.6,
                        }}
                    >
                        {formatMessage({id: 'statistics.parkingSpaces.timelineDescription'})}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flexWrap: 'wrap',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '4px',
                                    bgcolor: 'rgba(142, 36, 170, 0.32)',
                                    border: '1px solid #8E24AA',
                                }}
                            />

                            <Typography
                                sx={{
                                    color: '#777196',
                                    fontSize: 12,
                                    fontWeight: 800,
                                }}
                            >
                                {formatMessage({id: 'statistics.parkingSpaces.occupied'})}
                            </Typography>
                        </Box>

                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                            <Box
                                sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '4px',
                                    bgcolor: 'rgba(255, 152, 0, 0.32)',
                                    border: '1px solid #FF9800',
                                }}
                            />

                            <Typography
                                sx={{
                                    color: '#777196',
                                    fontSize: 12,
                                    fontWeight: 800,
                                }}
                            >
                                {formatMessage({id: 'statistics.parkingSpaces.reserved'})}
                            </Typography>
                        </Box>
                    </Box>

                    <StatisticsDatePicker
                        mode="day"
                        value={selectedDate}
                        onChange={onDateChange}
                    />
                </Box>
            </Box>

            <Box
                sx={{
                    position: 'relative',
                    height: 132,
                    borderRadius: '18px',
                    bgcolor: '#FFFFFF',
                    overflow: 'hidden',
                }}
            >
                {hours.map((hour) => {
                    const left = `${(hour / 24) * 100}%`;

                    return (
                        <Box
                            key={hour}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                bottom: 24,
                                left,
                                borderLeft: '1px solid #EEE5F4',
                            }}
                        />
                    );
                })}

                {data.items.map((item, index) => {
                    const startMinutes = getMinutesFromTime(item.from);
                    const endMinutes = getMinutesFromTime(item.to);
                    const left = `${(startMinutes / dayMinutes) * 100}%`;
                    const width = `${((endMinutes - startMinutes) / dayMinutes) * 100}%`;
                    const isOccupied = item.status === 'OCCUPIED';

                    return (
                        <Box
                            key={`${item.status}-${item.from}-${item.to}-${index}`}
                            sx={{
                                position: 'absolute',
                                left,
                                width,
                                top: 20,
                                height: 78,
                                borderRadius: '8px',
                                bgcolor: isOccupied
                                    ? 'rgba(142, 36, 170, 0.28)'
                                    : 'rgba(255, 152, 0, 0.32)',
                                border: isOccupied
                                    ? '1px solid #8E24AA'
                                    : '1px solid #FF9800',
                                boxShadow: isOccupied
                                    ? '0 12px 22px rgba(142,36,170,0.16)'
                                    : '0 12px 22px rgba(255,152,0,0.14)',
                            }}
                        />
                    );
                })}

                <Box
                    sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(25, 1fr)',
                    }}
                >
                    {hours.map((hour) => (
                        <Typography
                            key={hour}
                            sx={{
                                color: '#8E24AA',
                                fontSize: 10,
                                fontWeight: 700,
                                textAlign: 'left',
                            }}
                        >
                            {String(hour % 24).padStart(2, '0')}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};