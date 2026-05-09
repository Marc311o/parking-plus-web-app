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

                {DAYS.map((day) => (
                    <Typography
                        key={day.value}
                        sx={{
                            color: '#6B007B',
                            textAlign: 'center',
                            fontSize: 15,
                            fontWeight: 500,
                            lineHeight: 1,
                        }}
                    >
                        {intl.formatMessage({id: day.id})}
                    </Typography>
                ))}
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
                    {HOURS.map((hour) => (
                        <Typography
                            key={hour}
                            sx={{
                                color: '#6B007B',
                                fontSize: 15,
                                lineHeight: 1,
                                textAlign: 'right',
                                pr: 0.8,
                            }}
                        >
                            {String(hour).padStart(2, '0')}
                        </Typography>
                    ))}
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
                            onClick={() => onBlockClick(block)}
                        />
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default TariffSchedule;