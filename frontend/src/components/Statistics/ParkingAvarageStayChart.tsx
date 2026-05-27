import {useState, type MouseEvent} from 'react';
import {
    Box,
    Paper,
    Typography,
} from '@mui/material';
import {useIntl} from 'react-intl';
import {
    type AverageStayPeriod,
    type AverageStayResponse,
    type ParkingSpaceType,
} from '@api/Statistics';
import {StatisticsPeriodDatePicker} from './StatisticsPeriodDatePicker';

type ParkingAverageStayChartProps = {
    data: AverageStayResponse;
    selectedPeriod: AverageStayPeriod;
    selectedDate: string;
    onPeriodChange: (period: AverageStayPeriod) => void;
    onDateChange: (date: string) => void;
};

const getAverageStayDatePickerMode = (period: AverageStayPeriod) => {
    if (period === 'YEARLY') {
        return 'year';
    }

    if (period === 'MONTHLY') {
        return 'month';
    }

    if (period === 'WEEKLY') {
        return 'week';
    }

    return 'day';
};

const spaceTypeConfig: Record<
    ParkingSpaceType,
    {
        color: string;
        translationId: string;
    }
> = {
    REGULAR_ABLEBODIED: {
        color: '#8F2CFF',
        translationId: 'statistics.averageStay.spaceTypes.REGULAR_ABLEBODIED',
    },
    REGULAR_HANDICAPED: {
        color: '#C9D3FF',
        translationId: 'statistics.averageStay.spaceTypes.REGULAR_HANDICAPED',
    },
    EV_ABLEBODIED: {
        color: '#4B43F1',
        translationId: 'statistics.averageStay.spaceTypes.EV_ABLEBODIED',
    },
    EV_HANDICAPED: {
        color: '#6FE7C8',
        translationId: 'statistics.averageStay.spaceTypes.EV_HANDICAPED',
    },
    REGULAR_BOTH: {
        color: '#F5A623',
        translationId: 'statistics.averageStay.spaceTypes.REGULAR_BOTH',
    },
    EV_BOTH: {
        color: '#FF6B9A',
        translationId: 'statistics.averageStay.spaceTypes.EV_BOTH',
    },
};

const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
        return `${remainingMinutes}min`;
    }

    if (remainingMinutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}min`;
};

const CircularProgressRing = ({
                                  value,
                                  maxValue,
                                  color,
                                  size,
                                  strokeWidth,
                                  offset,
                                  isActive,
                                  onMouseEnter,
                                  onMouseMove,
                                  onMouseLeave,
                                  onClick,
                              }: {
    value: number;
    maxValue: number;
    color: string;
    size: number;
    strokeWidth: number;
    offset: number;
    isActive: boolean;
    onMouseEnter: () => void;
    onMouseMove: (event: MouseEvent<SVGGElement>) => void;
    onMouseLeave: () => void;
    onClick: () => void;
}) => {
    const radius = size / 2 - strokeWidth / 2 - offset;
    const circumference = 2 * Math.PI * radius;
    const progress = maxValue > 0 ? value / maxValue : 0;
    const dashOffset = circumference * (1 - progress);

    return (
        <g
            onMouseEnter={onMouseEnter}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            style={{cursor: 'pointer'}}
        >
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="transparent"
                strokeWidth={strokeWidth + 14}
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />

            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={isActive ? strokeWidth + 3 : strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{
                    filter: isActive
                        ? 'drop-shadow(0 8px 14px rgba(143,44,255,0.22))'
                        : 'none',
                    transition: '0.2s ease',
                }}
            />
        </g>
    );
};

export const ParkingAverageStayChart = ({
                                            data,
                                            selectedPeriod,
                                            selectedDate,
                                            onPeriodChange,
                                            onDateChange,
                                        }: ParkingAverageStayChartProps) => {
    const {formatMessage} = useIntl();

    const [hoveredSpaceType, setHoveredSpaceType] = useState<ParkingSpaceType | null>(null);
    const [selectedSpaceType, setSelectedSpaceType] = useState<ParkingSpaceType | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({x: 0, y: 0});

    const periods = [
        {
            value: 'DAILY' as AverageStayPeriod,
            label: formatMessage({id: 'statistics.averageStay.periods.daily'}),
        },
        {
            value: 'WEEKLY' as AverageStayPeriod,
            label: formatMessage({id: 'statistics.averageStay.periods.weekly'}),
        },
        {
            value: 'MONTHLY' as AverageStayPeriod,
            label: formatMessage({id: 'statistics.averageStay.periods.monthly'}),
        },
        {
            value: 'YEARLY' as AverageStayPeriod,
            label: formatMessage({id: 'statistics.averageStay.periods.yearly'}),
        },
    ];

    const maxAverageMinutes = Math.max(
        ...data.categories.map((category) => category.averageMinutes),
        1
    );

    const activeSpaceType = hoveredSpaceType ?? selectedSpaceType;

    const activeCategory = activeSpaceType
        ? data.categories.find((category) => category.spaceType === activeSpaceType)
        : null;

    const activeConfig = activeCategory
        ? spaceTypeConfig[activeCategory.spaceType]
        : null;

    const ringSize = 260;
    const strokeWidth = 9;
    const ringGap = 18;

    const handleRingClick = (spaceType: ParkingSpaceType) => {
        setSelectedSpaceType((current) => (current === spaceType ? null : spaceType));
    };

    const handleTooltipMouseMove = (event: MouseEvent<SVGGElement | HTMLDivElement>) => {
        setTooltipPosition({
            x: event.clientX,
            y: event.clientY,
        });
    };

    const handleTooltipMouseLeave = () => {
        setHoveredSpaceType(null);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                width: '100%',
                minHeight: 520,
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
                        {formatMessage({id: 'statistics.averageStay.title'})}
                    </Typography>

                    <Typography
                        sx={{
                            color: '#8D87AA',
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                    >
                        {formatMessage({id: 'statistics.averageStay.description'})}
                    </Typography>
                </Box>

                <StatisticsPeriodDatePicker
                    periods={periods}
                    selectedPeriod={selectedPeriod}
                    selectedDate={selectedDate}
                    getMode={getAverageStayDatePickerMode}
                    onPeriodChange={onPeriodChange}
                    onDateChange={onDateChange}
                />
            </Box>

            <Box
                sx={{
                    height: 1,
                    bgcolor: '#F0EEF7',
                    mb: 4,
                }}
            />

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        lg: '340px 1fr',
                    },
                    gap: {
                        xs: 4,
                        lg: 6,
                    },
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: {
                            xs: 'center',
                            lg: 'flex-start',
                        },
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            width: ringSize,
                            height: ringSize,
                        }}
                    >
                        <svg
                            width={ringSize}
                            height={ringSize}
                            viewBox={`0 0 ${ringSize} ${ringSize}`}
                        >
                            {data.categories.map((category, index) => (
                                <circle
                                    key={`${category.spaceType}-background`}
                                    cx={ringSize / 2}
                                    cy={ringSize / 2}
                                    r={ringSize / 2 - strokeWidth / 2 - index * ringGap}
                                    fill="transparent"
                                    stroke="#E8E7F1"
                                    strokeWidth={strokeWidth}
                                />
                            ))}

                            {data.categories.map((category, index) => {
                                const config = spaceTypeConfig[category.spaceType];
                                const isActive = activeSpaceType === category.spaceType;

                                return (
                                    <CircularProgressRing
                                        key={category.spaceType}
                                        value={category.averageMinutes}
                                        maxValue={maxAverageMinutes}
                                        color={config.color}
                                        size={ringSize}
                                        strokeWidth={strokeWidth}
                                        offset={index * ringGap}
                                        isActive={isActive}
                                        onMouseEnter={() => setHoveredSpaceType(category.spaceType)}
                                        onMouseMove={handleTooltipMouseMove}
                                        onMouseLeave={handleTooltipMouseLeave}
                                        onClick={() => handleRingClick(category.spaceType)}
                                    />
                                );
                            })}
                        </svg>
                    </Box>
                </Box>

                <Box>
                    <Typography
                        sx={{
                            color: '#1F1A3D',
                            fontSize: {
                                xs: 44,
                                md: 52,
                            },
                            fontWeight: 900,
                            lineHeight: 1,
                            mb: 1,
                        }}
                    >
                        {formatDuration(data.overallAverageMinutes)}
                    </Typography>

                    <Typography
                        sx={{
                            color: '#8D87AA',
                            fontSize: 13,
                            fontWeight: 700,
                            mb: 4,
                        }}
                    >
                        {formatMessage({id: 'statistics.averageStay.totalDescription'})}
                    </Typography>

                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: '1fr 1fr',
                            },
                            gap: 2.2,
                        }}
                    >
                        {data.categories.map((category) => {
                            const config = spaceTypeConfig[category.spaceType];
                            const isActive = activeSpaceType === category.spaceType;

                            return (
                                <Box
                                    key={category.spaceType}
                                    onMouseEnter={(event) => {
                                        setHoveredSpaceType(category.spaceType);
                                        setTooltipPosition({
                                            x: event.clientX,
                                            y: event.clientY,
                                        });
                                    }}
                                    onMouseMove={handleTooltipMouseMove}
                                    onMouseLeave={handleTooltipMouseLeave}
                                    onClick={() => handleRingClick(category.spaceType)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.6,
                                        cursor: 'pointer',
                                        borderRadius: '16px',
                                        p: 1,
                                        ml: -1,
                                        transition: '0.2s ease',
                                        bgcolor: isActive ? '#F7F5FD' : 'transparent',
                                        '&:hover': {
                                            bgcolor: '#F7F5FD',
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 14,
                                            height: 14,
                                            borderRadius: '50%',
                                            bgcolor: config.color,
                                            flexShrink: 0,
                                        }}
                                    />

                                    <Box>
                                        <Typography
                                            sx={{
                                                color: '#777196',
                                                fontSize: 13,
                                                fontWeight: 700,
                                            }}
                                        >
                                            {formatMessage({id: config.translationId})}
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: '#1F1A3D',
                                                fontSize: 14,
                                                fontWeight: 900,
                                                mt: 0.2,
                                            }}
                                        >
                                            {formatDuration(category.averageMinutes)}
                                        </Typography>
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Box>

            {activeCategory && activeConfig && hoveredSpaceType && (
                <Box
                    sx={{
                        position: 'fixed',
                        left: tooltipPosition.x + 14,
                        top: tooltipPosition.y + 14,
                        zIndex: 9999,
                        bgcolor: '#211C43',
                        color: '#FFFFFF',
                        borderRadius: '14px',
                        px: 1.8,
                        py: 1.2,
                        minWidth: 170,
                        boxShadow: '0 18px 36px rgba(33,28,67,0.22)',
                        pointerEvents: 'none',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 0.8,
                        }}
                    >
                        <Box
                            sx={{
                                width: 9,
                                height: 9,
                                borderRadius: '50%',
                                bgcolor: activeConfig.color,
                                flexShrink: 0,
                            }}
                        />

                        <Typography
                            sx={{
                                color: '#D8D3EE',
                                fontSize: 11,
                                fontWeight: 800,
                                lineHeight: 1.2,
                            }}
                        >
                            {formatMessage({id: activeConfig.translationId})}
                        </Typography>
                    </Box>

                    <Typography
                        sx={{
                            color: '#FFFFFF',
                            fontSize: 18,
                            fontWeight: 900,
                            lineHeight: 1,
                        }}
                    >
                        {formatDuration(activeCategory.averageMinutes)}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
};