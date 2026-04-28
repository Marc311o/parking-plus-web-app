import {useState} from 'react';
import {
    Box,
    Paper,
    Typography,
} from '@mui/material';
import {useIntl} from 'react-intl';
import {type EntriesResponse} from '@api/Statistics';
import {StatisticsDatePicker} from './StatisticsDatePicker';

type ParkingEntriesChartProps = {
    data: EntriesResponse;
    onWeekSelect: (weekStart: string) => void;
};

export const ParkingEntriesChart = ({
                                        data,
                                        onWeekSelect,
                                    }: ParkingEntriesChartProps) => {
    const {formatMessage, locale} = useIntl();

    const formatTotal = (value: number) => {
        return new Intl.NumberFormat(locale).format(value);
    };

    const maxValue = Math.max(...data.points.map((point) => point.value), 1);

    const defaultHighlightedIndex = data.points.reduce(
        (bestIndex, point, index, points) =>
            point.value > points[bestIndex].value ? index : bestIndex,
        0
    );

    const [selectedBarIndex, setSelectedBarIndex] = useState(defaultHighlightedIndex);

    const highlightedIndex =
        selectedBarIndex >= 0 && selectedBarIndex < data.points.length
            ? selectedBarIndex
            : defaultHighlightedIndex;

    const averageValue = Math.round(data.total / Math.max(data.points.length, 1));

    const chartScaleMax = Math.max(Math.ceil(maxValue / 10) * 10, 10);
    const chartHeight = 260;

    const chartLines = [
        chartScaleMax,
        Math.round(chartScaleMax * 0.75),
        Math.round(chartScaleMax * 0.5),
        Math.round(chartScaleMax * 0.25),
        0,
    ];

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
                        {formatMessage({id: 'statistics.entries.title'})}
                    </Typography>

                    <Typography
                        sx={{
                            color: '#8D87AA',
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                    >
                        {formatMessage({id: 'statistics.entries.description'})}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        mt: {
                            xs: 0,
                            lg: -0.8,
                        },
                    }}
                >
                    <StatisticsDatePicker
                        mode="week"
                        value={data.from}
                        onChange={onWeekSelect}
                    />
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        lg: '220px 1fr',
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
                            p: 2.5,
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
                            {formatMessage({id: 'statistics.entries.totalLabel'})}
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
                                {formatMessage({id: 'statistics.entries.totalDescription'})}
                            </Typography>
                        </Box>
                    </Box>

                    <Box
                        sx={{
                            borderRadius: '22px',
                            bgcolor: '#F7F5FD',
                            border: '1px solid #EEEAF8',
                            p: 2.5,
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
                            {formatMessage({id: 'statistics.entries.averageLabel'})}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1.4,
                                color: '#1F1A3D',
                                fontSize: 32,
                                fontWeight: 900,
                                lineHeight: 1,
                            }}
                        >
                            {formatTotal(averageValue)}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.8,
                                color: '#8D87AA',
                                fontSize: 13,
                                fontWeight: 700,
                            }}
                        >
                            {formatMessage({id: 'statistics.entries.averageDescription'})}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        height: {
                            xs: 360,
                            md: 390,
                        },
                        position: 'relative',
                        borderRadius: '24px',
                        bgcolor: '#FFFFFF',
                        border: '1px solid #F0EEF7',
                        px: {
                            xs: 2.2,
                            md: 3.2,
                        },
                        pt: {
                            xs: 4,
                            md: 4.5,
                        },
                        pb: {
                            xs: 3,
                            md: 3,
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 66,
                            right: 28,
                            bottom: 72,
                            height: chartHeight,
                        }}
                    >
                        {chartLines.map((line) => {
                            const top = `${100 - (line / chartScaleMax) * 100}%`;

                            return (
                                <Box
                                    key={line}
                                    sx={{
                                        position: 'absolute',
                                        left: 0,
                                        right: 0,
                                        top,
                                        borderTop:
                                            line === 0
                                                ? '1px solid #E6E1F1'
                                                : '1px dashed #E9E5F5',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            position: 'absolute',
                                            left: -44,
                                            top: -9,
                                            color: '#777196',
                                            fontSize: 12,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {formatTotal(line)}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            left: 66,
                            right: 28,
                            bottom: 30,
                            height: chartHeight + 42,
                            display: 'grid',
                            gridTemplateColumns: `repeat(${data.points.length}, minmax(52px, 1fr))`,
                            gap: {
                                xs: 1.5,
                                md: 2.8,
                            },
                            alignItems: 'end',
                            zIndex: 2,
                        }}
                    >
                        {data.points.map((point, index) => {
                            const isHighlighted = index === highlightedIndex;

                            const barHeight = Math.max(
                                (point.value / chartScaleMax) * chartHeight,
                                14
                            );

                            return (
                                <Box
                                    key={`${point.label}-${index}`}
                                    onClick={() => setSelectedBarIndex(index)}
                                    sx={{
                                        height: chartHeight + 42,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                        position: 'relative',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: chartHeight,
                                            display: 'flex',
                                            alignItems: 'flex-end',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            width: '100%',
                                        }}
                                    >
                                        {isHighlighted && (
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    bottom: barHeight + 14,
                                                    bgcolor: '#211C43',
                                                    color: '#fff',
                                                    px: 2.2,
                                                    py: 1.1,
                                                    borderRadius: '12px',
                                                    fontSize: 13,
                                                    fontWeight: 900,
                                                    minWidth: 72,
                                                    textAlign: 'center',
                                                    boxShadow:
                                                        '0 12px 24px rgba(33,28,67,0.18)',
                                                    '&::after': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        left: '50%',
                                                        bottom: -6,
                                                        transform: 'translateX(-50%)',
                                                        width: 0,
                                                        height: 0,
                                                        borderLeft:
                                                            '6px solid transparent',
                                                        borderRight:
                                                            '6px solid transparent',
                                                        borderTop:
                                                            '6px solid #211C43',
                                                    },
                                                }}
                                            >
                                                {formatTotal(point.value)}
                                            </Box>
                                        )}

                                        <Box
                                            sx={{
                                                width: {
                                                    xs: 34,
                                                    md: 42,
                                                },
                                                height: barHeight,
                                                borderRadius: '14px 14px 5px 5px',
                                                background: isHighlighted
                                                    ? 'linear-gradient(180deg, #8F2CFF 0%, #B832F1 100%)'
                                                    : '#EFE4FA',
                                                boxShadow: isHighlighted
                                                    ? '0 14px 28px rgba(143,44,255,0.25)'
                                                    : 'none',
                                                transition: '0.2s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    background:
                                                        'linear-gradient(180deg, #8F2CFF 0%, #B832F1 100%)',
                                                    boxShadow:
                                                        '0 14px 28px rgba(143,44,255,0.22)',
                                                },
                                            }}
                                        />
                                    </Box>

                                    <Typography
                                        sx={{
                                            mt: 1.6,
                                            height: 24,
                                            color: isHighlighted
                                                ? '#1F1A3D'
                                                : '#777196',
                                            fontSize: 12,
                                            fontWeight: 900,
                                            letterSpacing: 0.4,
                                        }}
                                    >
                                        {point.label}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};