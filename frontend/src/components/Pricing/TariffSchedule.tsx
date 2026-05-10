import {useMemo, useState} from 'react';
import {Box, CircularProgress, Typography} from '@mui/material';
import {useIntl} from 'react-intl';
import type {TariffVisualBlock} from './TariffScheduleTile';
import TariffScheduleTile from './TariffScheduleTile';

const DAYS = [
    {value: 1, id: 'prices.schedule.days.mondayShort'},
    {value: 2, id: 'prices.schedule.days.tuesdayShort'},
    {value: 3, id: 'prices.schedule.days.wednesdayShort'},
    {value: 4, id: 'prices.schedule.days.thursdayShort'},
    {value: 5, id: 'prices.schedule.days.fridayShort'},
    {value: 6, id: 'prices.schedule.days.saturdayShort'},
    {value: 7, id: 'prices.schedule.days.sundayShort'},
];

const HOURS = Array.from({length: 24}, (_, index) => index);

const getCurrentDayOfWeek = () => {
    const day = new Date().getDay();

    return day === 0 ? 7 : day;
};

type TariffScheduleProps = {
    blocks: TariffVisualBlock[];
    selectedBlockKey?: string;
    isLoading: boolean;
    onBlockClick: (block: TariffVisualBlock) => void;
};

const TariffSchedule = ({
                            blocks,
                            selectedBlockKey,
                            isLoading,
                            onBlockClick,
                        }: TariffScheduleProps) => {
    const intl = useIntl();

    const [highlightedDay, setHighlightedDay] = useState(getCurrentDayOfWeek);
    const [highlightedHour, setHighlightedHour] = useState(() => new Date().getHours());

    const highlightedBlockKey = useMemo(() => {
        const highlightedBlock = blocks.find((block) =>
            block.days.includes(highlightedDay) &&
            highlightedHour >= block.startHour &&
            highlightedHour < block.endHour
        );

        return highlightedBlock?.key;
    }, [blocks, highlightedDay, highlightedHour]);

    const highlightedRowTop = `${(highlightedHour / 24) * 100}%`;

    return (
        <Box
            sx={{
                width: '100%',
                minWidth: 760,
            }}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '42px repeat(7, 1fr)',
                    height: 30,
                    alignItems: 'center',
                }}
            >
                <Box/>

                {DAYS.map((day) => {
                    const active = day.value === highlightedDay;

                    return (
                        <Typography
                            key={day.value}
                            onClick={() => setHighlightedDay(day.value)}
                            sx={{
                                color: active ? '#DC2626' : '#6B007B',
                                textAlign: 'center',
                                fontSize: 15,
                                fontWeight: active ? 700 : 500,
                                lineHeight: 1,
                                cursor: 'pointer',
                                borderRadius: '8px',
                                py: 0.5,
                                bgcolor: active ? 'rgba(220, 38, 38, 0.10)' : 'transparent',
                                transition: '0.15s ease',
                                '&:hover': {
                                    bgcolor: active
                                        ? 'rgba(220, 38, 38, 0.14)'
                                        : 'rgba(142, 36, 170, 0.08)',
                                },
                            }}
                        >
                            {intl.formatMessage({id: day.id})}
                        </Typography>
                    );
                })}
            </Box>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '42px 1fr',
                    height: 540,
                    minHeight: 540,
                }}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateRows: 'repeat(24, 1fr)',
                        mr: 2,
                    }}
                >
                    {HOURS.map((hour) => {
                        const active = hour === highlightedHour;

                        return (
                            <Typography
                                key={hour}
                                onClick={() => setHighlightedHour(hour)}
                                sx={{
                                    color: active ? '#DC2626' : '#6B007B',
                                    fontSize: 15,
                                    lineHeight: 1,
                                    textAlign: 'right',
                                    pr: 0.8,
                                    cursor: 'pointer',
                                    fontWeight: active ? 700 : 400,
                                    borderRadius: '6px',
                                    bgcolor: active ? 'rgba(220, 38, 38, 0.10)' : 'transparent',
                                    transition: '0.15s ease',
                                    '&:hover': {
                                        bgcolor: active
                                            ? 'rgba(220, 38, 38, 0.14)'
                                            : 'rgba(142, 36, 170, 0.08)',
                                    },
                                }}
                            >
                                {String(hour).padStart(2, '0')}
                            </Typography>
                        );
                    })}
                </Box>

                <Box
                    sx={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        backgroundImage: `
                            linear-gradient(to right, rgba(142,36,170,0.12) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(142,36,170,0.12) 1px, transparent 1px)
                        `,
                        backgroundSize: 'calc(100% / 7) calc(100% / 24)',
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: highlightedRowTop,
                            height: 'calc(100% / 24)',
                            bgcolor: 'rgba(220, 38, 38, 0.06)',
                            pointerEvents: 'none',
                            zIndex: 0,
                        }}
                    />

                    <Box
                        sx={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: highlightedRowTop,
                            borderTop: '2px solid rgba(220, 38, 38, 0.75)',
                            pointerEvents: 'none',
                            zIndex: 2,
                        }}
                    />

                    {isLoading && (
                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                bgcolor: 'rgba(255,255,255,0.75)',
                                zIndex: 5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <CircularProgress/>
                        </Box>
                    )}

                    {blocks.map((block) => (
                        <TariffScheduleTile
                            key={block.key}
                            block={block}
                            selected={selectedBlockKey === block.key}
                            highlighted={highlightedBlockKey === block.key}
                            onClick={() => onBlockClick(block)}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default TariffSchedule;