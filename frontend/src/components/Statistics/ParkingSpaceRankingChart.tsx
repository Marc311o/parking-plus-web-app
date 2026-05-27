import {useEffect, useState} from 'react';
import {
    Box,
    Paper,
    Typography,
} from '@mui/material';
import {useIntl} from 'react-intl';
import {
    type ParkingFloor,
    type ParkingSpaceRankingResponse,
    type EntriesPeriod,
} from '@api/Statistics';
import {StatisticsPeriodDatePicker} from './StatisticsPeriodDatePicker';

type ParkingSpaceRankingChartProps = {
    data: ParkingSpaceRankingResponse;
    selectedPeriod: EntriesPeriod;
    selectedDate: string;
    selectedFloor: ParkingFloor;
    floors: ParkingFloor[];
    onPeriodChange: (period: EntriesPeriod) => void;
    onDateChange: (date: string) => void;
    onFloorChange: (floor: ParkingFloor) => void;
};

export const ParkingSpaceRankingChart = ({
                                             data,
                                             selectedPeriod,
                                             selectedDate,
                                             selectedFloor,
                                             floors,
                                             onPeriodChange,
                                             onDateChange,
                                             onFloorChange,
                                         }: ParkingSpaceRankingChartProps) => {
    const {formatMessage, locale} = useIntl();

    const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(
        data.points[0]?.spaceId ?? null
    );

    useEffect(() => {
        setSelectedSpaceId(data.points[0]?.spaceId ?? null);
    }, [data.points]);

    const formatTotal = (value: number) => {
        return new Intl.NumberFormat(locale).format(value);
    };

    const maxValue = Math.max(...data.points.map((point) => point.value), 1);

    const selectedPoint =
        data.points.find((point) => point.spaceId === selectedSpaceId) ??
        data.points[0];

    const periods = [
        {
            value: 'DAILY' as EntriesPeriod,
            label: formatMessage({id: 'statistics.entries.periods.daily'}),
        },
        {
            value: 'WEEKLY' as EntriesPeriod,
            label: formatMessage({id: 'statistics.entries.periods.weekly'}),
        },
        {
            value: 'MONTHLY' as EntriesPeriod,
            label: formatMessage({id: 'statistics.entries.periods.monthly'}),
        },
        {
            value: 'YEARLY' as EntriesPeriod,
            label: formatMessage({id: 'statistics.entries.periods.yearly'}),
        },
    ];

    const getRankingDatePickerMode = (period: EntriesPeriod) => {
        if (period === 'YEARLY') return 'year';
        if (period === 'MONTHLY') return 'month';
        if (period === 'WEEKLY') return 'week';
        return 'day';
    };

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                minHeight: 560,
                borderRadius: '28px',
                border: '1px solid #F0EEF7',
                boxShadow: '0 18px 50px rgba(19, 16, 48, 0.08)',
                p: {
                    xs: 2.5,
                    md: 4,
                },
                overflow: 'hidden',
                position: 'relative',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #FBFAFF 100%)',
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: -90,
                    right: -90,
                    width: 220,
                    height: 220,
                    borderRadius: '50%',
                    background:
                        'radial-gradient(circle, rgba(143,44,255,0.15) 0%, rgba(143,44,255,0) 70%)',
                }}
            />

            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 3,
                    flexDirection: {
                        xs: 'column',
                        lg: 'row',
                    },
                    mb: 4,
                }}
            >
                <Box>
                    <Typography
                        sx={{
                            color: '#1F1A3D',
                            fontSize: {
                                xs: 24,
                                md: 32,
                            },
                            lineHeight: 1.1,
                            fontWeight: 900,
                            mb: 1,
                        }}
                    >
                        {formatMessage({id: 'statistics.spaceRanking.title'})}
                    </Typography>

                    <Typography
                        sx={{
                            color: '#8D87AA',
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                    >
                        {formatMessage({id: 'statistics.spaceRanking.description'})}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'stretch',
                        gap: 1.5,
                        flexWrap: {
                            xs: 'wrap',
                            lg: 'nowrap',
                        },
                        justifyContent: {
                            xs: 'flex-start',
                            lg: 'flex-end',
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: { xs: '100%', sm: 80 },
                            height: { lg: 120 },
                            bgcolor: '#F7F5FD',
                            borderRadius: '22px',
                            p: 0.8,
                            display: 'flex',
                            flexDirection: { xs: 'row', lg: 'column' },
                            gap: 0.6,
                            border: '1px solid #EEEAF8',
                            boxSizing: 'border-box'
                        }}
                    >
                        {floors.map((floor) => {
                            const isSelected = floor === selectedFloor;
                            return (
                                <Box
                                    key={floor}
                                    onClick={() => onFloorChange(floor)}
                                    sx={{
                                        flex: 1,
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        bgcolor: isSelected ? '#211C43' : 'transparent',
                                        color: isSelected ? '#FFFFFF' : '#9B96B7',
                                        fontSize: 16,
                                        fontWeight: 900,
                                        transition: '0.2s ease',
                                        userSelect: 'none',
                                        '&:hover': {
                                            bgcolor: isSelected ? '#211C43' : '#FFFFFF',
                                            color: isSelected ? '#FFFFFF' : '#7A2DFF',
                                        },
                                    }}
                                >
                                    {floor}
                                </Box>
                            );
                        })}
                    </Box>

                    <StatisticsPeriodDatePicker
                        periods={periods}
                        selectedPeriod={selectedPeriod}
                        selectedDate={selectedDate}
                        getMode={getRankingDatePickerMode}
                        onPeriodChange={onPeriodChange}
                        onDateChange={onDateChange}
                    />
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        lg: '210px minmax(0, 1fr)',
                    },
                    gap: 3,
                    alignItems: 'stretch',
                }}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            borderRadius: '22px',
                            background: 'linear-gradient(180deg, #8F2CFF 0%, #B832F1 100%)',
                            p: 2.4,
                            color: '#FFFFFF',
                            minHeight: 130,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            boxShadow: '0 18px 35px rgba(143,44,255,0.26)',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 12,
                                fontWeight: 800,
                                color: 'rgba(255,255,255,0.78)',
                                textTransform: 'uppercase',
                                letterSpacing: 0.6,
                            }}
                        >
                            {formatMessage({id: 'statistics.spaceRanking.totalLabel'})}
                        </Typography>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 38,
                                    fontWeight: 900,
                                    lineHeight: 1,
                                }}
                            >
                                {formatTotal(data.total)}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.8,
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: 'rgba(255,255,255,0.78)',
                                }}
                            >
                                {formatMessage({id: 'statistics.spaceRanking.totalDescription'})}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            borderRadius: '22px',
                            bgcolor: '#F7F5FD',
                            border: '1px solid #EEEAF8',
                            p: 2.4,
                            minHeight: 116,
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 12,
                                fontWeight: 800,
                                color: '#9B96B7',
                                textTransform: 'uppercase',
                                letterSpacing: 0.6,
                            }}
                        >
                            {formatMessage({id: 'statistics.spaceRanking.topLabel'})}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1.4,
                                color: '#1F1A3D',
                                fontSize: 28,
                                fontWeight: 900,
                                lineHeight: 1,
                            }}
                        >
                            {selectedPoint?.spaceId ?? '-'}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.8,
                                color: '#8D87AA',
                                fontSize: 13,
                                fontWeight: 700,
                            }}
                        >
                            {selectedPoint
                                ? formatMessage(
                                    {id: 'statistics.spaceRanking.topDescription'},
                                    {value: formatTotal(selectedPoint.value)}
                                )
                                : '-'}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        minHeight: 390,
                        maxHeight: 520,
                        overflowY: 'auto',
                        position: 'relative',
                        borderRadius: '24px',
                        bgcolor: '#FFFFFF',
                        border: '1px solid #F0EEF7',
                        p: {
                            xs: 2.2,
                            md: 3,
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: 'grid',
                            gap: 1.6,
                        }}
                    >
                        {data.points.map((point, index) => {
                            const isSelected = point.spaceId === selectedPoint?.spaceId;
                            const width = `${Math.max((point.value / maxValue) * 100, 6)}%`;

                            return (
                                <Box
                                    key={point.spaceId}
                                    onClick={() => setSelectedSpaceId(point.spaceId)}
                                    sx={{
                                        cursor: 'pointer',
                                        borderRadius: '18px',
                                        p: 1.4,
                                        transition: '0.2s ease',
                                        bgcolor: isSelected ? '#F7F5FD' : 'transparent',
                                        border: isSelected
                                            ? '1px solid #EEEAF8'
                                            : '1px solid transparent',
                                        '&:hover': {
                                            bgcolor: '#F7F5FD',
                                            borderColor: '#EEEAF8',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: 2,
                                            mb: 1,
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: '11px',
                                                    bgcolor: isSelected ? '#211C43' : '#F1E9FF',
                                                    color: isSelected ? '#FFFFFF' : '#7A2DFF',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 12,
                                                    fontWeight: 900,
                                                }}
                                            >
                                                {index + 1}
                                            </Box>

                                            <Typography
                                                sx={{
                                                    color: '#1F1A3D',
                                                    fontSize: 14,
                                                    fontWeight: 900,
                                                }}
                                            >
                                                {point.spaceId}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            sx={{
                                                color: isSelected ? '#7A2DFF' : '#777196',
                                                fontSize: 13,
                                                fontWeight: 900,
                                            }}
                                        >
                                            {formatMessage(
                                                {id: 'statistics.spaceRanking.value'},
                                                {value: formatTotal(point.value)}
                                            )}
                                        </Typography>
                                    </Box>

                                    <Box
                                        sx={{
                                            height: 12,
                                            borderRadius: '999px',
                                            bgcolor: '#EFEAF8',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width,
                                                height: '100%',
                                                borderRadius: '999px',
                                                background: isSelected
                                                    ? 'linear-gradient(90deg, #8F2CFF 0%, #B832F1 100%)'
                                                    : '#D9C8F3',
                                                boxShadow: isSelected
                                                    ? '0 10px 22px rgba(143,44,255,0.24)'
                                                    : 'none',
                                                transition: '0.2s ease',
                                            }}
                                        />
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};