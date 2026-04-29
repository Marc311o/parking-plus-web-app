import {useMemo, useState} from 'react';
import {
    Box,
    IconButton,
    Popover,
    Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {useIntl} from 'react-intl';

type StatisticsDatePickerMode = 'year' | 'week' | 'day';

type StatisticsDatePickerProps = {
    mode: StatisticsDatePickerMode;
    value: string;
    onChange: (value: string) => void;
};

const toIsoDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const getDateFromIso = (date: string) => {
    const [year, month, day] = date.split('-').map(Number);

    return new Date(year, month - 1, day, 12, 0, 0, 0);
};

const normalizeDate = (date: Date) => {
    const copiedDate = new Date(date);

    copiedDate.setHours(12, 0, 0, 0);

    return copiedDate;
};

const getMonday = (date: Date) => {
    const copiedDate = normalizeDate(date);
    const day = copiedDate.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    copiedDate.setDate(copiedDate.getDate() + diffToMonday);

    return copiedDate;
};

const addDays = (date: Date, days: number) => {
    const copiedDate = normalizeDate(date);

    copiedDate.setDate(copiedDate.getDate() + days);

    return copiedDate;
};

const addMonths = (date: Date, months: number) => {
    const copiedDate = normalizeDate(date);

    copiedDate.setMonth(copiedDate.getMonth() + months);

    return copiedDate;
};

const formatDate = (date: string) => {
    const [year, month, day] = date.split('-');

    return `${day}.${month}.${year}`;
};

const formatDateRange = (from: string, to: string) => {
    return `${formatDate(from)} - ${formatDate(to)}`;
};

const isSameDay = (firstDate: Date, secondDate: Date) => {
    return toIsoDate(firstDate) === toIsoDate(secondDate);
};

const isDateInWeek = (date: Date, weekStart: Date) => {
    const dateIso = toIsoDate(date);
    const weekStartIso = toIsoDate(getMonday(weekStart));
    const weekEndIso = toIsoDate(addDays(getMonday(weekStart), 6));

    return dateIso >= weekStartIso && dateIso <= weekEndIso;
};

const isWeekStart = (date: Date, weekStart: Date) => {
    return toIsoDate(date) === toIsoDate(getMonday(weekStart));
};

const isWeekEnd = (date: Date, weekStart: Date) => {
    return toIsoDate(date) === toIsoDate(addDays(getMonday(weekStart), 6));
};

const getMonthDays = (visibleMonth: Date) => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1, 12, 0, 0, 0);
    const firstCalendarDay = getMonday(firstDayOfMonth);

    return Array.from({length: 42}, (_, index) => addDays(firstCalendarDay, index));
};

const getMonthLabel = (date: Date, locale: string) => {
    return new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
    }).format(date);
};

const getDisplayValue = (mode: StatisticsDatePickerMode, value: string) => {
    const date = getDateFromIso(value);

    if (mode === 'year') {
        return String(date.getFullYear());
    }

    if (mode === 'week') {
        const weekStart = getMonday(date);
        const weekEnd = addDays(weekStart, 6);

        return formatDateRange(toIsoDate(weekStart), toIsoDate(weekEnd));
    }

    return formatDate(value);
};

export const StatisticsDatePicker = ({
                                         mode,
                                         value,
                                         onChange,
                                     }: StatisticsDatePickerProps) => {
    const {formatMessage, locale} = useIntl();

    const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
    const [visibleMonth, setVisibleMonth] = useState(getDateFromIso(value));
    const [hoveredWeekStart, setHoveredWeekStart] = useState<string | null>(null);

    const selectedDate = useMemo(() => getDateFromIso(value), [value]);
    const selectedWeekStart = useMemo(() => getMonday(getDateFromIso(value)), [value]);
    const monthDays = useMemo(() => getMonthDays(visibleMonth), [visibleMonth]);

    const weekdays = useMemo(
        () => [
            formatMessage({id: 'statistics.weekday.mondayShort'}),
            formatMessage({id: 'statistics.weekday.tuesdayShort'}),
            formatMessage({id: 'statistics.weekday.wednesdayShort'}),
            formatMessage({id: 'statistics.weekday.thursdayShort'}),
            formatMessage({id: 'statistics.weekday.fridayShort'}),
            formatMessage({id: 'statistics.weekday.saturdayShort'}),
            formatMessage({id: 'statistics.weekday.sundayShort'}),
        ],
        [formatMessage]
    );

    const isOpen = Boolean(anchorElement);

    const currentYear = selectedDate.getFullYear();
    const yearOptions = Array.from({length: 9}, (_, index) => currentYear - 4 + index);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElement(event.currentTarget);
        setVisibleMonth(getDateFromIso(value));
    };

    const handleClose = () => {
        setAnchorElement(null);
        setHoveredWeekStart(null);
    };

    const handlePrevious = () => {
        if (mode === 'year') {
            onChange(`${selectedDate.getFullYear() - 1}-01-01`);
            return;
        }

        if (mode === 'week') {
            onChange(toIsoDate(addDays(getMonday(selectedDate), -7)));
            return;
        }

        onChange(toIsoDate(addDays(selectedDate, -1)));
    };

    const handleNext = () => {
        if (mode === 'year') {
            onChange(`${selectedDate.getFullYear() + 1}-01-01`);
            return;
        }

        if (mode === 'week') {
            onChange(toIsoDate(addDays(getMonday(selectedDate), 7)));
            return;
        }

        onChange(toIsoDate(addDays(selectedDate, 1)));
    };

    const handleDayClick = (date: Date) => {
        if (mode === 'week') {
            onChange(toIsoDate(getMonday(date)));
            handleClose();
            return;
        }

        onChange(toIsoDate(date));
        handleClose();
    };

    const handleDayMouseEnter = (date: Date) => {
        if (mode !== 'week') {
            return;
        }

        setHoveredWeekStart(toIsoDate(getMonday(date)));
    };

    const handleYearClick = (year: number) => {
        onChange(`${year}-01-01`);
        handleClose();
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                    bgcolor: '#F7F5FD',
                    borderRadius: '22px',
                    p: 1,
                    border: '1px solid #EEEAF8',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
                }}
            >
                <IconButton
                    onClick={handlePrevious}
                    sx={{
                        width: 38,
                        height: 38,
                        bgcolor: '#FFFFFF',
                        color: '#5C577A',
                        boxShadow: '0 6px 14px rgba(31,26,61,0.08)',
                        '&:hover': {
                            bgcolor: '#FFFFFF',
                            color: '#7A2DFF',
                        },
                    }}
                >
                    <ChevronLeftIcon/>
                </IconButton>

                <Box
                    onClick={handleOpen}
                    sx={{
                        width: '100%',
                        height: 44,
                        px: 1.8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1.2,
                        cursor: 'pointer',
                        borderRadius: '16px',
                        transition: '0.2s ease',
                        '&:hover': {
                            bgcolor: '#FFFFFF',
                            boxShadow: '0 6px 14px rgba(31,26,61,0.06)',
                        },
                    }}
                >
                    <CalendarMonthIcon
                        sx={{
                            fontSize: 24,
                            color: '#7A2DFF',
                            flexShrink: 0,
                        }}
                    />

                    <Typography
                        sx={{
                            color: '#1F1A3D',
                            fontSize: 15,
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {getDisplayValue(mode, value)}
                    </Typography>
                </Box>

                <IconButton
                    onClick={handleNext}
                    sx={{
                        width: 38,
                        height: 38,
                        bgcolor: '#FFFFFF',
                        color: '#5C577A',
                        boxShadow: '0 6px 14px rgba(31,26,61,0.08)',
                        '&:hover': {
                            bgcolor: '#FFFFFF',
                            color: '#7A2DFF',
                        },
                    }}
                >
                    <ChevronRightIcon/>
                </IconButton>
            </Box>

            <Popover
                open={isOpen}
                anchorEl={anchorElement}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                {mode === 'year' ? (
                    <Box
                        sx={{
                            minWidth: 220,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 1,
                        }}
                    >
                        {yearOptions.map((year) => {
                            const isSelected = year === currentYear;

                            return (
                                <Box
                                    key={year}
                                    onClick={() => handleYearClick(year)}
                                    sx={{
                                        height: 48,
                                        borderRadius: '16px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        bgcolor: isSelected ? '#7A2DFF' : '#F7F5FD',
                                        color: isSelected ? '#FFFFFF' : '#1F1A3D',
                                        fontWeight: 900,
                                        transition: '0.15s ease',
                                        '&:hover': {
                                            bgcolor: isSelected ? '#7A2DFF' : '#F1E9FF',
                                            color: isSelected ? '#FFFFFF' : '#7A2DFF',
                                        },
                                    }}
                                >
                                    {year}
                                </Box>
                            );
                        })}
                    </Box>
                ) : (
                    <>
                        <Box
                            sx={{
                                minWidth: 500,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 2,
                            }}
                        >
                            <IconButton
                                onClick={() =>
                                    setVisibleMonth((current) => addMonths(current, -1))
                                }
                                sx={{
                                    width: 34,
                                    height: 34,
                                    bgcolor: '#F7F5FD',
                                    color: '#5C577A',
                                    '&:hover': {
                                        bgcolor: '#F1E9FF',
                                        color: '#7A2DFF',
                                    },
                                }}
                            >
                                <ChevronLeftIcon/>
                            </IconButton>

                            <Typography
                                sx={{
                                    color: '#1F1A3D',
                                    fontSize: 15,
                                    fontWeight: 900,
                                    textTransform: 'capitalize',
                                }}
                            >
                                {getMonthLabel(visibleMonth, locale)}
                            </Typography>

                            <IconButton
                                onClick={() =>
                                    setVisibleMonth((current) => addMonths(current, 1))
                                }
                                sx={{
                                    width: 34,
                                    height: 34,
                                    bgcolor: '#F7F5FD',
                                    color: '#5C577A',
                                    '&:hover': {
                                        bgcolor: '#F1E9FF',
                                        color: '#7A2DFF',
                                    },
                                }}
                            >
                                <ChevronRightIcon/>
                            </IconButton>
                        </Box>

                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                mb: 1,
                            }}
                        >
                            {weekdays.map((day) => (
                                <Typography
                                    key={day}
                                    sx={{
                                        color: '#9B96B7',
                                        fontSize: 11,
                                        fontWeight: 900,
                                        textAlign: 'center',
                                    }}
                                >
                                    {day}
                                </Typography>
                            ))}
                        </Box>

                        <Box
                            onMouseLeave={() => setHoveredWeekStart(null)}
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                rowGap: 0.8,
                            }}
                        >
                            {monthDays.map((date) => {
                                const hoveredWeekStartDate = hoveredWeekStart
                                    ? getDateFromIso(hoveredWeekStart)
                                    : null;

                                const isCurrentMonth =
                                    date.getMonth() === visibleMonth.getMonth();

                                const isSelectedDay = isSameDay(date, selectedDate);

                                const isSelectedWeek =
                                    mode === 'week' && isDateInWeek(date, selectedWeekStart);

                                const isHoveredWeek =
                                    mode === 'week' && hoveredWeekStartDate
                                        ? isDateInWeek(date, hoveredWeekStartDate)
                                        : false;

                                const isSelectedWeekStart =
                                    mode === 'week' && isWeekStart(date, selectedWeekStart);

                                const isSelectedWeekEnd =
                                    mode === 'week' && isWeekEnd(date, selectedWeekStart);

                                const isHoveredWeekStart =
                                    mode === 'week' && hoveredWeekStartDate
                                        ? isWeekStart(date, hoveredWeekStartDate)
                                        : false;

                                const isHoveredWeekEnd =
                                    mode === 'week' && hoveredWeekStartDate
                                        ? isWeekEnd(date, hoveredWeekStartDate)
                                        : false;

                                const isActiveWeek = isSelectedWeek || isHoveredWeek;
                                const isActiveWeekStart =
                                    isSelectedWeekStart || isHoveredWeekStart;
                                const isActiveWeekEnd =
                                    isSelectedWeekEnd || isHoveredWeekEnd;

                                const isToday = isSameDay(date, new Date());

                                return (
                                    <Box
                                        key={toIsoDate(date)}
                                        onClick={() => handleDayClick(date)}
                                        onMouseEnter={() => handleDayMouseEnter(date)}
                                        sx={{
                                            height: 38,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            bgcolor:
                                                mode === 'week' && isActiveWeek
                                                    ? isHoveredWeek
                                                        ? 'rgba(122, 45, 255, 0.18)'
                                                        : 'rgba(122, 45, 255, 0.12)'
                                                    : 'transparent',
                                            color:
                                                isActiveWeek || isSelectedDay
                                                    ? '#7A2DFF'
                                                    : isCurrentMonth
                                                        ? '#1F1A3D'
                                                        : '#C5C0D6',
                                            fontSize: 13,
                                            fontWeight:
                                                isActiveWeek || isSelectedDay ? 900 : 700,
                                            transition: '0.15s ease',
                                            borderTopLeftRadius:
                                                isActiveWeekStart ? '14px' : 0,
                                            borderBottomLeftRadius:
                                                isActiveWeekStart ? '14px' : 0,
                                            borderTopRightRadius:
                                                isActiveWeekEnd ? '14px' : 0,
                                            borderBottomRightRadius:
                                                isActiveWeekEnd ? '14px' : 0,
                                            '&:hover': {
                                                color: '#7A2DFF',
                                                bgcolor:
                                                    mode === 'day'
                                                        ? '#F1E9FF'
                                                        : undefined,
                                            },
                                            '&::before':
                                                isSelectedDay || isSelectedWeekStart
                                                    ? {
                                                        content: '""',
                                                        position: 'absolute',
                                                        width: 28,
                                                        height: 28,
                                                        borderRadius: '50%',
                                                        bgcolor: '#7A2DFF',
                                                        zIndex: 0,
                                                    }
                                                    : undefined,
                                            '&::after': isToday
                                                ? {
                                                    content: '""',
                                                    position: 'absolute',
                                                    bottom: 5,
                                                    width: 4,
                                                    height: 4,
                                                    borderRadius: '50%',
                                                    bgcolor:
                                                        isSelectedDay || isSelectedWeekStart
                                                            ? '#FFFFFF'
                                                            : '#7A2DFF',
                                                    zIndex: 2,
                                                }
                                                : undefined,
                                        }}
                                    >
                                        <Box
                                            component="span"
                                            sx={{
                                                position: 'relative',
                                                zIndex: 1,
                                                color:
                                                    isSelectedDay || isSelectedWeekStart
                                                        ? '#FFFFFF'
                                                        : 'inherit',
                                            }}
                                        >
                                            {date.getDate()}
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </>
                )}
            </Popover>
        </>
    );
};