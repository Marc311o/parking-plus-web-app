import {useEffect, useMemo, useState} from 'react';
import {
    Box,
    Paper,
    Typography,
} from '@mui/material';
import {useIntl} from 'react-intl';
import {
    type RevenuePeriod,
    type RevenueResponse,
} from '@api/Statistics';
import {StatisticsDatePicker} from './StatisticsDatePicker';

type ParkingRevenueChartProps = {
    data: RevenueResponse;
    selectedPeriod: RevenuePeriod;
    selectedDate: string;
    onPeriodChange: (period: RevenuePeriod) => void;
    onDateChange: (date: string) => void;
};
type ChartPoint = {
    x: number;
    y: number;
    value: number;
    label: string;
};

const chartWidth = 1100;
const chartHeight = 340;
const paddingLeft = 42;
const paddingRight = 48;
const paddingTop = 30;
const paddingBottom = 42;

const periods: Array<{
    value: RevenuePeriod;
    translationId: string;
}> = [
    {
        value: 'DAILY',
        translationId: 'statistics.revenue.periods.daily',
    },
    {
        value: 'WEEKLY',
        translationId: 'statistics.revenue.periods.weekly',
    },
    {
        value: 'YEARLY',
        translationId: 'statistics.revenue.periods.yearly',
    },
];

const getRoundedMax = (value: number) => {
    if (value <= 1000) {
        return 1000;
    }

    return Math.ceil(value / 1000) * 1000;
};

const buildLinePath = (points: ChartPoint[]) => {
    if (points.length === 0) {
        return '';
    }

    if (points.length === 1) {
        return `M ${points[0].x} ${points[0].y}`;
    }

    const path = points.reduce((currentPath, point, index, allPoints) => {
        if (index === 0) {
            return `M ${point.x} ${point.y}`;
        }

        const previousPoint = allPoints[index - 1];
        const controlPointX = (previousPoint.x + point.x) / 2;

        return `${currentPath} C ${controlPointX} ${previousPoint.y}, ${controlPointX} ${point.y}, ${point.x} ${point.y}`;
    }, '');

    return path;
};

const buildAreaPath = (linePath: string, points: ChartPoint[]) => {
    if (!linePath || points.length === 0) {
        return '';
    }

    const firstPoint = points[0];
    const lastPoint = points[points.length - 1];
    const bottomY = chartHeight - paddingBottom;

    return `${linePath} L ${lastPoint.x} ${bottomY} L ${firstPoint.x} ${bottomY} Z`;
};

export const ParkingRevenueChart = ({
                                        data,
                                        selectedPeriod,
                                        selectedDate,
                                        onPeriodChange,
                                        onDateChange,
                                    }: ParkingRevenueChartProps) => {
    const {formatMessage, locale} = useIntl();

    const [selectedPointIndex, setSelectedPointIndex] = useState(
        Math.max(data.points.length - 4, 0)
    );

    useEffect(() => {
        setSelectedPointIndex(Math.max(data.points.length - 4, 0));
    }, [data.points]);

    const formatMoney = (value: number) => {
        return new Intl.NumberFormat(locale, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const maxValue = useMemo(() => {
        return getRoundedMax(Math.max(...data.points.map((point) => point.value), 1));
    }, [data.points]);

    const chartPoints = useMemo<ChartPoint[]>(() => {
        const availableWidth = chartWidth - paddingLeft - paddingRight;
        const availableHeight = chartHeight - paddingTop - paddingBottom;

        return data.points.map((point, index) => {
            const x =
                paddingLeft +
                (availableWidth / Math.max(data.points.length - 1, 1)) * index;

            const y =
                chartHeight -
                paddingBottom -
                (point.value / maxValue) * availableHeight;

            return {
                x,
                y,
                value: point.value,
                label: point.label,
            };
        });
    }, [data.points, maxValue]);

    const selectedPoint =
        chartPoints[selectedPointIndex] ?? chartPoints[chartPoints.length - 1];

    const linePath = buildLinePath(chartPoints);
    const areaPath = buildAreaPath(linePath, chartPoints);

    const chartLines = [
        maxValue,
        Math.round(maxValue * 0.75),
        Math.round(maxValue * 0.5),
        Math.round(maxValue * 0.25),
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
                        {formatMessage({id: 'statistics.revenue.title'})}
                    </Typography>

                    <Typography
                        sx={{
                            color: '#8D87AA',
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                    >
                        {formatMessage({id: 'statistics.revenue.description'})}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.2,
                        flexWrap: 'wrap',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            bgcolor: '#F7F5FD',
                            borderRadius: '18px',
                            p: 0.6,
                            gap: 0.4,
                            border: '1px solid #EEEAF8',
                        }}
                    >
                        {periods.map((period) => {
                            const isSelected = period.value === selectedPeriod;

                            return (
                                <Box
                                    key={period.value}
                                    onClick={() => onPeriodChange(period.value)}
                                    sx={{
                                        px: 2,
                                        height: 36,
                                        borderRadius: '13px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        bgcolor: isSelected ? '#211C43' : 'transparent',
                                        color: isSelected ? '#FFFFFF' : '#9B96B7',
                                        fontSize: 12,
                                        fontWeight: 900,
                                        transition: '0.2s ease',
                                        '&:hover': {
                                            bgcolor: isSelected ? '#211C43' : '#FFFFFF',
                                            color: isSelected ? '#FFFFFF' : '#7A2DFF',
                                        },
                                    }}
                                >
                                    {formatMessage({id: period.translationId})}
                                </Box>
                            );
                        })}
                    </Box>

                    <StatisticsDatePicker
                        mode={
                            selectedPeriod === 'YEARLY'
                                ? 'year'
                                : selectedPeriod === 'WEEKLY'
                                    ? 'week'
                                    : 'day'
                        }
                        value={selectedDate}
                        onChange={onDateChange}
                    />
                </Box>
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        lg: '170px minmax(0, 1fr)',
                    },
                    gap: 2,
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
                            color: '#FFFFFF',
                            p: 2,
                            minHeight: 108,
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
                            {formatMessage({id: 'statistics.revenue.totalLabel'})}
                        </Typography>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: 32,
                                    fontWeight: 900,
                                    lineHeight: 1,
                                }}
                            >
                                {formatMoney(data.total)} {data.currency}
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.8,
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: 'rgba(255,255,255,0.78)',
                                }}
                            >
                                {formatMessage({id: 'statistics.revenue.totalDescription'})}
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
                            {formatMessage({id: 'statistics.revenue.changeLabel'})}
                        </Typography>

                        <Typography
                            sx={{
                                mt: 1.4,
                                color:
                                    data.previousPeriodChangePercent >= 0
                                        ? '#19B85A'
                                        : '#E05252',
                                fontSize: 28,
                                fontWeight: 900,
                                lineHeight: 1,
                            }}
                        >
                            {data.previousPeriodChangePercent >= 0 ? '+' : ''}
                            {data.previousPeriodChangePercent.toFixed(1)}%
                        </Typography>

                        <Typography
                            sx={{
                                mt: 0.8,
                                color: '#8D87AA',
                                fontSize: 13,
                                fontWeight: 700,
                            }}
                        >
                            {formatMessage({id: 'statistics.revenue.changeDescription'})}
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        height: {
                            xs: 390,
                            md: 440,
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
                    <svg
                        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                        width="100%"
                        height="360"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="revenueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8F2CFF" stopOpacity="0.24"/>
                                <stop offset="100%" stopColor="#8F2CFF" stopOpacity="0"/>
                            </linearGradient>
                        </defs>

                        {chartLines.map((line) => {
                            const y =
                                chartHeight -
                                paddingBottom -
                                (line / maxValue) *
                                (chartHeight - paddingTop - paddingBottom);

                            return (
                                <g key={line}>
                                    <line
                                        x1={paddingLeft}
                                        x2={chartWidth - paddingRight}
                                        y1={y}
                                        y2={y}
                                        stroke={line === 0 ? '#E6E1F1' : '#EEEAF6'}
                                        strokeWidth="1"
                                    />

                                    <text
                                        x={chartWidth - 8}
                                        y={y + 4}
                                        fill="#777196"
                                        fontSize="12"
                                        fontWeight="700"
                                        textAnchor="end"
                                    >
                                        {line >= 1000 ? `${line / 1000}k` : line}
                                    </text>
                                </g>
                            );
                        })}

                        <path d={areaPath} fill="url(#revenueAreaGradient)"/>

                        <path
                            d={linePath}
                            fill="none"
                            stroke="#5D38FF"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {selectedPoint && (
                            <>
                                <line
                                    x1={selectedPoint.x}
                                    x2={selectedPoint.x}
                                    y1={selectedPoint.y}
                                    y2={chartHeight - paddingBottom}
                                    stroke="#5D38FF"
                                    strokeWidth="2"
                                />

                                <circle
                                    cx={selectedPoint.x}
                                    cy={selectedPoint.y}
                                    r="8"
                                    fill="#5D38FF"
                                    stroke="#FFFFFF"
                                    strokeWidth="5"
                                />
                            </>
                        )}

                        {chartPoints.map((point, index) => {
                            const isSelected = index === selectedPointIndex;

                            return (
                                <text
                                    key={`${point.label}-label`}
                                    x={point.x}
                                    y={chartHeight - 5}
                                    fill={isSelected ? '#1F1A3D' : '#777196'}
                                    fontSize="11"
                                    fontWeight="900"
                                    textAnchor="middle"
                                    style={{cursor: 'pointer'}}
                                    onClick={() => setSelectedPointIndex(index)}
                                >
                                    {point.label}
                                </text>
                            );
                        })}
                    </svg>

                    {selectedPoint && (
                        <Box
                            sx={{
                                position: 'absolute',
                                left: `${(selectedPoint.x / chartWidth) * 100}%`,
                                top: `${selectedPoint.y + 8}px`,
                                transform: 'translate(-50%, -100%)',
                                bgcolor: '#211C43',
                                color: '#FFFFFF',
                                borderRadius: '12px',
                                px: 1.6,
                                py: 1,
                                minWidth: 110,
                                textAlign: 'center',
                                boxShadow: '0 12px 24px rgba(33,28,67,0.18)',
                                pointerEvents: 'none',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontSize: 10,
                                    color: '#BEB9D6',
                                    fontWeight: 700,
                                }}
                            >
                                {selectedPoint.label}
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 13,
                                    fontWeight: 900,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {formatMoney(selectedPoint.value)} {data.currency}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};