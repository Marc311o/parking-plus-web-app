import {Box, Typography} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {useIntl} from 'react-intl';
import type {TariffDTO} from '@api/Tariffs';

export type TariffVisualBlock = {
    key: string;
    days: number[];
    startHour: number;
    endHour: number;
    firstHourTariffs: TariffDTO[];
    nextHourTariffs: TariffDTO[];
    firstHourPrice: number;
    nextHourPrice: number;
};

type TariffScheduleTileProps = {
    block: TariffVisualBlock;
    selected: boolean;
    onClick: () => void;
};

const TariffScheduleTile = ({
                                block,
                                selected,
                                onClick,
                            }: TariffScheduleTileProps) => {
    const intl = useIntl();

    const firstDay = block.days[0];
    const dayCount = block.days.length;
    const hourCount = block.endHour - block.startHour;

    const isCompact = hourCount <= 1 || dayCount <= 1;
    const isVeryCompact = hourCount <= 1 && dayCount <= 1;

    const left = `${((firstDay - 1) / 7) * 100}%`;
    const width = `${(dayCount / 7) * 100}%`;
    const top = `${(block.startHour / 24) * 100}%`;
    const height = `${(hourCount / 24) * 100}%`;

    const formatPrice = (value: number) =>
        intl.formatMessage(
            {id: 'prices.tile.priceValue'},
            {
                value: intl.formatNumber(value, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }),
            }
        );

    const firstHourLabel = intl.formatMessage(
        {id: 'prices.tile.firstHour'},
        {price: formatPrice(block.firstHourPrice)}
    );

    const nextHourLabel = intl.formatMessage(
        {id: 'prices.tile.nextHour'},
        {price: formatPrice(block.nextHourPrice)}
    );

    return (
        <Box
            onClick={onClick}
            sx={{
                position: 'absolute',
                left,
                top,
                width,
                height,
                p: isVeryCompact ? '1px' : '2px',
                boxSizing: 'border-box',
                cursor: 'pointer',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    borderRadius: '5px',
                    bgcolor: selected ? '#D5A6DE' : '#D8B0DE',
                    border: selected ? '2px solid #8E24AA' : '1px solid #B84BC8',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    px: isVeryCompact ? 0.3 : isCompact ? 0.45 : 0.7,
                    py: isVeryCompact ? 0.15 : isCompact ? 0.25 : 0.45,
                    overflow: 'hidden',
                    color: '#6B007B',
                    transition: '0.15s ease',
                    '&:hover': {
                        bgcolor: '#D2A2DC',
                        borderColor: '#8E24AA',
                    },
                }}
            >
                {!isVeryCompact && (
                    <EditRoundedIcon
                        sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            fontSize: isCompact ? 12 : 16,
                            color: '#7B158F',
                            opacity: selected ? 1 : 0.6,
                        }}
                    />
                )}

                <Box
                    sx={{
                        width: '100%',
                        minWidth: 0,
                        textAlign: 'right',
                    }}
                >
                    {[firstHourLabel, nextHourLabel].map((label) => (
                        <Typography
                            key={label}
                            title={label}
                            sx={{
                                width: '100%',
                                minWidth: 0,
                                color: '#6B007B',
                                fontSize: isVeryCompact
                                    ? 'clamp(6px, 0.46vw, 8px)'
                                    : isCompact
                                        ? 'clamp(7px, 0.58vw, 10px)'
                                        : {
                                            xs: 10,
                                            md: 12,
                                            xl: 14,
                                        },
                                fontWeight: 500,
                                lineHeight: isVeryCompact ? 0.95 : isCompact ? 1 : 1.08,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {label}
                        </Typography>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};

export default TariffScheduleTile;