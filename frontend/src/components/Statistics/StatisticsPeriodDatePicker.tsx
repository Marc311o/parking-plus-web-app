import {Box} from '@mui/material';
import {StatisticsDatePicker} from './StatisticsDatePicker';

type PeriodOption<TPeriod extends string> = {
    value: TPeriod;
    label: string;
};

type StatisticsPeriodDatePickerMode = 'day' | 'week' | 'month' | 'year';

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
    const commonWidth = {
        xs: '100%',
        sm: 390,
    };
    const commonHeight = 54;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                alignItems: {
                    xs: 'flex-start',
                    lg: 'flex-end',
                },
                width: commonWidth,
                flexShrink: 0,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    bgcolor: '#F7F5FD',
                    borderRadius: '22px',
                    p: 0.8,
                    gap: 0.6,
                    border: '1px solid #EEEAF8',
                    width: '100%',
                    height: commonHeight,
                    boxSizing: 'border-box'
                }}
            >
                {periods.map((period) => {
                    const isSelected = period.value === selectedPeriod;

                    return (
                        <Box
                            key={period.value}
                            onClick={() => onPeriodChange(period.value)}
                            sx={{
                                flex: 1,
                                height: '100%',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                bgcolor: isSelected ? '#211C43' : 'transparent',
                                color: isSelected ? '#FFFFFF' : '#9B96B7',
                                fontSize: 13,
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

            <StatisticsDatePicker
                mode={getMode(selectedPeriod)}
                value={selectedDate}
                onChange={onDateChange}
                sx={{
                    width: '100%',
                    height: commonHeight,
                    boxSizing: 'border-box'
                }}
            />
        </Box>
    );
};