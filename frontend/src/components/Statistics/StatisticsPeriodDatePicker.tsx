import {Box} from '@mui/material';
import {StatisticsDatePicker} from './StatisticsDatePicker';

type PeriodOption<TPeriod extends string> = {
    value: TPeriod;
    label: string;
};

type StatisticsPeriodDatePickerMode = 'day' | 'week' | 'year';

type StatisticsPeriodDatePickerProps<TPeriod extends string> = {
    periods: PeriodOption<TPeriod>[];
    selectedPeriod: TPeriod;
    selectedDate: string;
    getMode: (period: TPeriod) => StatisticsPeriodDatePickerMode;
    onPeriodChange: (period: TPeriod) => void;
    onDateChange: (date: string) => void;
};

export const StatisticsPeriodDatePicker = <TPeriod extends string>({
                                                                       periods,
                                                                       selectedPeriod,
                                                                       selectedDate,
                                                                       getMode,
                                                                       onPeriodChange,
                                                                       onDateChange,
                                                                   }: StatisticsPeriodDatePickerProps<TPeriod>) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                flexWrap: {
                    xs: 'wrap',
                    xl: 'nowrap',
                },
                justifyContent: {
                    xs: 'flex-start',
                    lg: 'flex-end',
                },
                minWidth: {
                    xs: '100%',
                    lg: 620,
                },
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
                    flexShrink: 0,
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
                                minWidth: 76,
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
                                userSelect: 'none',
                                '&:hover': {
                                    bgcolor: isSelected ? '#211C43' : '#FFFFFF',
                                    color: isSelected ? '#FFFFFF' : '#7A2DFF',
                                },
                            }}
                        >
                            {period.label}
                        </Box>
                    );
                })}
            </Box>

            <Box
                sx={{
                    width: {
                        xs: '100%',
                        sm: 390,
                    },
                    flexShrink: 0,
                    '& > div:first-of-type': {
                        width: '100%',
                        display: 'flex',
                    },
                    '& > div:first-of-type > button': {
                        flexShrink: 0,
                    },
                    '& > div:first-of-type > div:nth-of-type(2)': {
                        flex: 1,
                        minWidth: 0,
                        maxWidth: 'none',
                    },
                }}
            >
                <StatisticsDatePicker
                    mode={getMode(selectedPeriod)}
                    value={selectedDate}
                    onChange={onDateChange}
                />
            </Box>
        </Box>
    );
};