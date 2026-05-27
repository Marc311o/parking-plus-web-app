import {Box, Typography} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
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
    view: 'hourly' | 'daily';
    block: TariffVisualBlock;
    selected: boolean;
    highlighted: boolean;
    isAdmin: boolean;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    onDelete: (event: React.MouseEvent<HTMLElement>) => void;
};

const TariffScheduleTile = ({
                                view,
                                block,
                                selected,
                                highlighted,
                                isAdmin,
                                onClick,
                                onDelete,
                            }: TariffScheduleTileProps) => {
    const intl = useIntl();

    const firstDay = block.days[0];
    const dayCount = block.days.length;
    const hourCount = block.endHour - block.startHour;

    const isCompact = hourCount <= 1 || dayCount <= 1;
    const isVeryCompact = hourCount <= 1 && dayCount <= 1;

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

    const dailyPriceLabel = formatPrice(block.firstHourPrice);

    return (
        <Box
            onClick={onClick}
            sx={{
                gridColumn: `${firstDay} / span ${dayCount}`,
                gridRow: `${block.startHour + 1} / span ${hourCount}`,
                p: isVeryCompact ? '1px' : '2px',
                boxSizing: 'border-box',
                cursor: 'pointer',
                zIndex: selected ? 3 : highlighted ? 2 : 1,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    borderRadius: '5px',
                    bgcolor: selected
                        ? '#D5A6DE'
                        : highlighted
                            ? '#C17DCC'
                            : '#D8B0DE',
                    border: selected
                        ? '2px solid #8E24AA'
                        : highlighted
                            ? '2px solid #7B158F'
                            : '1px solid #B84BC8',
                    boxShadow: highlighted && !selected
                        ? '0 0 0 2px rgba(123, 21, 143, 0.22)'
                        : 'none',
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    px: isVeryCompact ? 0.3 : isCompact ? 0.45 : 0.7,
                    py: 0,
                    overflow: 'hidden',
                    color: '#6B007B',
                    transition: '0.15s ease',
                    '&:hover': {
                        bgcolor: selected
                            ? '#D5A6DE'
                            : highlighted
                                ? '#B96AC7'
                                : '#D2A2DC',
                        borderColor: '#8E24AA',
                    },
                }}
            >
                {isAdmin && !isVeryCompact && (
                    <>
                        <EditRoundedIcon
                            sx={{
                                position: 'absolute',
                                top: 4,
                                left: 4,
                                fontSize: isCompact ? 12 : 16,
                                color: '#7B158F',
                                opacity: selected ? 1 : 0.6,
                            }}
                        />
                        <CloseRoundedIcon
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(e);
                            }}
                            sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                fontSize: isCompact ? 14 : 18,
                                color: '#DC2626',
                                opacity: 0.7,
                                transition: '0.2s',
                                '&:hover': {
                                    opacity: 1,
                                    transform: 'scale(1.1)',
                                }
                            }}
                        />
                    </>
                )}

                <Box
                    sx={{
                        width: '100%',
                        minWidth: 0,
                        textAlign: 'right',
                    }}
                >
                    {view === 'daily' ? (
                        <Typography
                            title={dailyPriceLabel}
                            sx={{
                                width: '100%',
                                minWidth: 0,
                                color: '#6B007B',
                                fontSize: isVeryCompact ? 12 : isCompact ? 14 : 16,
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {dailyPriceLabel}
                        </Typography>
                    ) : (
                        [firstHourLabel, nextHourLabel].map((label) => (
                            <Typography
                                key={label}
                                title={label}
                                sx={{
                                    width: '100%',
                                    minWidth: 0,
                                    color: '#6B007B',
                                    fontSize: isVeryCompact ? 10 : isCompact ? 11 : 13,
                                    fontWeight: 500,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {label}
                            </Typography>
                        ))
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default TariffScheduleTile;