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

type WeekDatePickerProps = {
    from: string;
    to: string;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    onCurrentWeek?: () => void;
    onWeekSelect: (weekStart: string) => void;
};

const toIsoDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

const formatDate = (date: string) => {
    const [year, month, day] = date.split('-');

    return `${day}.${month}.${year}`;
};

const formatDateRange = (from: string, to: string) => {
    return `${formatDate(from)} - ${formatDate(to)}`;
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

export const WeekDatePicker = ({
                                   from,
                                   to,
                                   onPreviousWeek,
                                   onNextWeek,
                                   onWeekSelect,
                               }: WeekDatePickerProps) => {
    const {formatMessage, locale} = useIntl();

    const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
    const [visibleMonth, setVisibleMonth] = useState(getDateFromIso(from));
    const [hoveredWeekStart, setHoveredWeekStart] = useState<string | null>(null);

    const selectedWeekStart = useMemo(() => getMonday(getDateFromIso(from)), [from]);
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

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElement(event.currentTarget);
        setVisibleMonth(getDateFromIso(from));
    };

    const handleClose = () => {
        setAnchorElement(null);
        setHoveredWeekStart(null);
    };

    const handleDayClick = (date: Date) => {
        const weekStart = getMonday(date);

        onWeekSelect(toIsoDate(weekStart));
        handleClose();
    };

    const handleDayMouseEnter = (date: Date) => {
        const weekStart = getMonday(date);

        setHoveredWeekStart(toIsoDate(weekStart));
    };

    const handleCalendarMouseLeave = () => {
        setHoveredWeekStart(null);
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
                    onClick={onPreviousWeek}
                    aria-label={formatMessage({id: 'statistics.week.previous'})}
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
                        minWidth: {
                            xs: 210,
                            md: 285,
                        },
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
                        {formatDateRange(from, to)}
                    </Typography>
                </Box>

                <IconButton
                    onClick={onNextWeek}
                    aria-label={formatMessage({id: 'statistics.week.next'})}
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
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                        minWidth: 500,
                    }}
                >
                    <IconButton
                        onClick={() => setVisibleMonth((current) => addMonths(current, -1))}
                        aria-label={formatMessage({id: 'statistics.month.previous'})}
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
                        onClick={() => setVisibleMonth((current) => addMonths(current, 1))}
                        aria-label={formatMessage({id: 'statistics.month.next'})}
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
                    onMouseLeave={handleCalendarMouseLeave}
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

                        const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
                        const isSelectedWeek = isDateInWeek(date, selectedWeekStart);
                        const isHoveredWeek = hoveredWeekStartDate
                            ? isDateInWeek(date, hoveredWeekStartDate)
                            : false;

                        const isToday = isSameDay(date, new Date());
                        const isSelectedWeekStart = isWeekStart(date, selectedWeekStart);
                        const isSelectedWeekEnd = isWeekEnd(date, selectedWeekStart);
                        const isHoveredWeekStart = hoveredWeekStartDate
                            ? isWeekStart(date, hoveredWeekStartDate)
                            : false;
                        const isHoveredWeekEnd = hoveredWeekStartDate
                            ? isWeekEnd(date, hoveredWeekStartDate)
                            : false;

                        const isActiveWeek = isSelectedWeek || isHoveredWeek;
                        const isActiveWeekStart = isSelectedWeekStart || isHoveredWeekStart;
                        const isActiveWeekEnd = isSelectedWeekEnd || isHoveredWeekEnd;

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
                                    bgcolor: isActiveWeek
                                        ? isHoveredWeek
                                            ? 'rgba(122, 45, 255, 0.18)'
                                            : 'rgba(122, 45, 255, 0.12)'
                                        : 'transparent',
                                    color: isActiveWeek
                                        ? '#7A2DFF'
                                        : isCurrentMonth
                                            ? '#1F1A3D'
                                            : '#C5C0D6',
                                    fontSize: 13,
                                    fontWeight: isActiveWeek ? 900 : 700,
                                    transition: '0.15s ease',
                                    borderTopLeftRadius: isActiveWeekStart ? '14px' : 0,
                                    borderBottomLeftRadius: isActiveWeekStart ? '14px' : 0,
                                    borderTopRightRadius: isActiveWeekEnd ? '14px' : 0,
                                    borderBottomRightRadius: isActiveWeekEnd ? '14px' : 0,
                                    '&:hover': {
                                        color: '#7A2DFF',
                                    },
                                    '&::before': isSelectedWeekStart
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
                                            bgcolor: isSelectedWeekStart ? '#FFFFFF' : '#7A2DFF',
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
                                        color: isSelectedWeekStart ? '#FFFFFF' : 'inherit',
                                    }}
                                >
                                    {date.getDate()}
                                </Box>
                            </Box>
                        );
                    })}
                </Box>
            </Popover>
        </>
    );
};