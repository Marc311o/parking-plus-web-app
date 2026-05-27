import {useMemo, useState} from 'react';
import {
    Box,
    IconButton,
    Popover,
    Typography,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {useIntl} from 'react-intl';

type StatisticsDatePickerMode = 'year' | 'month' | 'week' | 'day';

type StatisticsDatePickerProps = {
    mode: StatisticsDatePickerMode;
    value: string;
    onChange: (value: string) => void;
    sx?: SxProps<Theme>;
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

const getSunday = (monday: Date) => {
    const sunday = new Date(monday);

    sunday.setDate(monday.getDate() + 6);

    return sunday;
};

export const StatisticsDatePicker = ({
                                         mode,
                                         value,
                                         onChange,
                                         sx
                                     }: StatisticsDatePickerProps) => {
    const intl = useIntl();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const date = useMemo(() => getDateFromIso(value), [value]);

    const label = useMemo(() => {
        if (mode === 'year') {
            return date.getFullYear().toString();
        }

        if (mode === 'month') {
            return intl.formatDate(date, {month: 'long', year: 'numeric'});
        }

        if (mode === 'week') {
            const monday = getMonday(date);
            const sunday = getSunday(monday);

            return `${intl.formatDate(monday, {
                day: 'numeric',
                month: 'short',
            })} - ${intl.formatDate(sunday, {day: 'numeric', month: 'short'})}`;
        }

        return intl.formatDate(date, {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    }, [mode, date, intl]);

    const handlePrevious = () => {
        const nextDate = new Date(date);

        if (mode === 'year') {
            nextDate.setFullYear(date.getFullYear() - 1);
        } else if (mode === 'month') {
            nextDate.setMonth(date.getMonth() - 1);
        } else if (mode === 'week') {
            nextDate.setDate(date.getDate() - 7);
        } else {
            nextDate.setDate(date.getDate() - 1);
        }

        onChange(toIsoDate(nextDate));
    };

    const handleNext = () => {
        const nextDate = new Date(date);

        if (mode === 'year') {
            nextDate.setFullYear(date.getFullYear() + 1);
        } else if (mode === 'month') {
            nextDate.setMonth(date.getMonth() + 1);
        } else if (mode === 'week') {
            nextDate.setDate(date.getDate() + 7);
        } else {
            nextDate.setDate(date.getDate() + 1);
        }

        onChange(toIsoDate(nextDate));
    };

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDateSelect = (newDate: Date) => {
        onChange(toIsoDate(newDate));
        handleClose();
    };

    const open = Boolean(anchorEl);

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                bgcolor: '#F7F5FD',
                borderRadius: '22px',
                p: 0.8,
                border: '1px solid #EEEAF8',
                ...sx
            }}
        >
            <IconButton
                onClick={handlePrevious}
                size="small"
                sx={{
                    bgcolor: '#FFFFFF',
                    boxShadow: '0 4px 10px rgba(31,26,61,0.05)',
                    '&:hover': {bgcolor: '#F1E9FF'},
                    flexShrink: 0,
                }}
            >
                <ChevronLeftIcon sx={{fontSize: 20, color: '#7A2DFF'}}/>
            </IconButton>

            <Box
                component="button"
                onClick={handleOpen}
                sx={{
                    border: 'none',
                    bgcolor: 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1.2,
                    px: 1.2,
                    py: 0.6,
                    borderRadius: '14px',
                    transition: '0.2s',
                    flex: 1,
                    minWidth: 0,
                    '&:hover': {
                        bgcolor: 'rgba(122,45,255,0.06)',
                    },
                }}
            >
                <CalendarMonthIcon sx={{fontSize: 18, color: '#7A2DFF', flexShrink: 0}}/>
                <Typography
                    sx={{
                        color: '#1F1A3D',
                        fontSize: 13,
                        fontWeight: 900,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textAlign: 'center'
                    }}
                >
                    {label}
                </Typography>
            </Box>

            <IconButton
                onClick={handleNext}
                size="small"
                sx={{
                    bgcolor: '#FFFFFF',
                    boxShadow: '0 4px 10px rgba(31,26,61,0.05)',
                    '&:hover': {bgcolor: '#F1E9FF'},
                    flexShrink: 0,
                }}
            >
                <ChevronRightIcon sx={{fontSize: 20, color: '#7A2DFF'}}/>
            </IconButton>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                slotProps={{
                    paper: {
                        sx: {
                            mt: 1.5,
                            borderRadius: '24px',
                            boxShadow: '0 24px 70px rgba(31,26,61,0.18)',
                            border: '1px solid #EEEAF8',
                            p: 2,
                        },
                    }
                }}
            >
                <CalendarView
                    mode={mode}
                    selectedDate={date}
                    onSelect={handleDateSelect}
                />
            </Popover>
        </Box>
    );
};

const CalendarView = ({
                          mode,
                          selectedDate,
                          onSelect,
                      }: {
    mode: StatisticsDatePickerMode;
    selectedDate: Date;
    onSelect: (date: Date) => void;
}) => {
    const [viewDate, setViewDate] = useState(new Date(selectedDate));

    const handlePrev = () => {
        const next = new Date(viewDate);
        next.setMonth(viewDate.getMonth() - 1);
        setViewDate(next);
    };

    const handleNext = () => {
        const next = new Date(viewDate);
        next.setMonth(viewDate.getMonth() + 1);
        setViewDate(next);
    };

    const daysInMonth = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const days = new Date(year, month + 1, 0).getDate();

        const offset = firstDay === 0 ? 6 : firstDay - 1;
        const result: (Date | null)[] = Array(offset).fill(null);

        for (let i = 1; i <= days; i++) {
            result.push(new Date(year, month, i, 12, 0, 0, 0));
        }

        return result;
    }, [viewDate]);

    const intl = useIntl();

    if (mode === 'year') {
        const currentYear = viewDate.getFullYear();
        const years = Array.from({length: 12}, (_, i) => currentYear - 5 + i);

        return (
            <Box sx={{width: 280}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', mb: 2, px: 1}}>
                    <Typography sx={{fontWeight: 900, color: '#1F1A3D'}}>Wybierz rok</Typography>
                </Box>
                <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1}}>
                    {years.map(year => {
                        const active = year === selectedDate.getFullYear();
                        return (
                            <Box
                                key={year}
                                onClick={() => onSelect(new Date(year, 0, 1, 12, 0, 0, 0))}
                                sx={{
                                    p: 1.5,
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    fontWeight: 800,
                                    fontSize: 14,
                                    bgcolor: active ? '#7A2DFF' : 'transparent',
                                    color: active ? '#FFF' : '#1F1A3D',
                                    '&:hover': {bgcolor: active ? '#7A2DFF' : '#F1E9FF'}
                                }}
                            >
                                {year}
                            </Box>
                        );
                    })}
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{width: 280}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, px: 1}}>
                <Typography sx={{fontWeight: 900, color: '#1F1A3D', textTransform: 'capitalize'}}>
                    {intl.formatDate(viewDate, {month: 'long', year: 'numeric'})}
                </Typography>
                <Box sx={{display: 'flex', gap: 0.5}}>
                    <IconButton size="small" onClick={handlePrev}><ChevronLeftIcon fontSize="small"/></IconButton>
                    <IconButton size="small" onClick={handleNext}><ChevronRightIcon fontSize="small"/></IconButton>
                </Box>
            </Box>

            <Box sx={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5}}>
                {['PN', 'WT', 'ŚR', 'CZ', 'PT', 'SB', 'ND'].map(d => (
                    <Typography key={d} sx={{fontSize: 10, fontWeight: 900, color: '#9B96B7', textAlign: 'center', mb: 1}}>
                        {d}
                    </Typography>
                ))}
                {daysInMonth.map((day, i) => {
                    if (!day) return <Box key={`empty-${i}`}/>;

                    const isSelected = mode === 'day'
                        ? day.getTime() === normalizeDate(selectedDate).getTime()
                        : mode === 'week'
                            ? day.getTime() >= getMonday(selectedDate).getTime() && day.getTime() <= getSunday(getMonday(selectedDate)).getTime()
                            : mode === 'month'
                                ? day.getMonth() === selectedDate.getMonth() && day.getFullYear() === selectedDate.getFullYear()
                                : false;

                    const isToday = day.toDateString() === new Date().toDateString();

                    return (
                        <Box
                            key={day.getTime()}
                            onClick={() => onSelect(day)}
                            sx={{
                                height: 34,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: 800,
                                bgcolor: isSelected ? '#7A2DFF' : 'transparent',
                                color: isSelected ? '#FFF' : '#1F1A3D',
                                border: isToday && !isSelected ? '1px solid #7A2DFF' : 'none',
                                '&:hover': {bgcolor: isSelected ? '#7A2DFF' : '#F1E9FF'}
                            }}
                        >
                            {day.getDate()}
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
};