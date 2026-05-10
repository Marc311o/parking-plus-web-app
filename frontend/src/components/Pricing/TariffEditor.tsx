import {Alert, Box, Button, TextField, Typography} from '@mui/material';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import {useIntl} from 'react-intl';
import type {TariffVisualBlock} from './TariffScheduleTile';

const DAYS = [
    {value: 1, id: 'prices.schedule.days.mondayShort'},
    {value: 2, id: 'prices.schedule.days.tuesdayShort'},
    {value: 3, id: 'prices.schedule.days.wednesdayShort'},
    {value: 4, id: 'prices.schedule.days.thursdayShort'},
    {value: 5, id: 'prices.schedule.days.fridayShort'},
    {value: 6, id: 'prices.schedule.days.saturdayShort'},
    {value: 7, id: 'prices.schedule.days.sundayShort'},
];

type TariffEditorProps = {
    selectedBlock: TariffVisualBlock | null;
    firstHourPrice: string;
    nextHourPrice: string;
    isSaving: boolean;
    saveError: string | null;
    onFirstHourPriceChange: (value: string) => void;
    onNextHourPriceChange: (value: string) => void;
    onSave: () => void;
};

const TariffEditor = ({
                          selectedBlock,
                          firstHourPrice,
                          nextHourPrice,
                          isSaving,
                          saveError,
                          onFirstHourPriceChange,
                          onNextHourPriceChange,
                          onSave,
                      }: TariffEditorProps) => {
    const intl = useIntl();

    const getDaysLabel = (days: number[]) => {
        if (days.length === 0) {
            return '-';
        }

        const getDayLabel = (value: number) => {
            const day = DAYS.find((item) => item.value === value);

            return day ? intl.formatMessage({id: day.id}) : String(value);
        };

        if (days.length === 1) {
            return getDayLabel(days[0]);
        }

        return `${getDayLabel(days[0])} – ${getDayLabel(days[days.length - 1])}`;
    };

    return (
        <Box
            sx={{
                mt: 1.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.9,
            }}
        >
            {selectedBlock && (
                <Typography
                    sx={{
                        color: '#6B007B',
                        fontSize: 13,
                        fontWeight: 500,
                    }}
                >
                    {intl.formatMessage(
                        {id: 'prices.editor.editing'},
                        {
                            days: getDaysLabel(selectedBlock.days),
                            startHour: String(selectedBlock.startHour).padStart(2, '0'),
                            endHour: String(selectedBlock.endHour).padStart(2, '0'),
                        }
                    )}
                </Typography>
            )}

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 72px auto',
                    columnGap: 1,
                    rowGap: 0.7,
                    alignItems: 'center',
                }}
            >
                <Typography
                    sx={{
                        color: '#6B007B',
                        fontSize: 12,
                        textAlign: 'right',
                    }}
                >
                    {intl.formatMessage({id: 'prices.editor.firstHourLabel'})}
                </Typography>

                <TextField
                    size="small"
                    value={firstHourPrice}
                    disabled={!selectedBlock || isSaving}
                    onChange={(event) => onFirstHourPriceChange(event.target.value)}
                    inputProps={{
                        inputMode: 'decimal',
                        style: {
                            textAlign: 'center',
                            padding: '0 8px',
                            height: 20,
                            fontSize: 12,
                        },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            height: 24,
                            borderRadius: '8px',
                        },
                    }}
                />

                <Typography
                    sx={{
                        color: '#6B007B',
                        fontSize: 12,
                    }}
                >
                    {intl.formatMessage({id: 'prices.editor.currencyShort'})}
                </Typography>

                <Typography
                    sx={{
                        color: '#6B007B',
                        fontSize: 12,
                        textAlign: 'right',
                    }}
                >
                    {intl.formatMessage({id: 'prices.editor.nextHourLabel'})}
                </Typography>

                <TextField
                    size="small"
                    value={nextHourPrice}
                    disabled={!selectedBlock || isSaving}
                    onChange={(event) => onNextHourPriceChange(event.target.value)}
                    inputProps={{
                        inputMode: 'decimal',
                        style: {
                            textAlign: 'center',
                            padding: '0 8px',
                            height: 20,
                            fontSize: 12,
                        },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            height: 24,
                            borderRadius: '8px',
                        },
                    }}
                />

                <Typography
                    sx={{
                        color: '#6B007B',
                        fontSize: 12,
                    }}
                >
                    {intl.formatMessage({id: 'prices.editor.currencyShort'})}
                </Typography>
            </Box>

            {saveError && (
                <Alert
                    severity="error"
                    sx={{
                        py: 0,
                        borderRadius: 2,
                    }}
                >
                    {saveError}
                </Alert>
            )}

            <Button
                variant="contained"
                disabled={!selectedBlock || isSaving}
                onClick={onSave}
                sx={{
                    minWidth: 96,
                    height: 24,
                    borderRadius: '7px',
                    bgcolor: '#9C13B8',
                    textTransform: 'none',
                    fontSize: 11,
                    boxShadow: 'none',
                    '&:hover': {
                        bgcolor: '#7F0F96',
                        boxShadow: 'none',
                    },
                }}
            >
                {intl.formatMessage({
                    id: isSaving ? 'prices.editor.savingButton' : 'prices.editor.saveButton',
                })}
            </Button>

            <Box
                sx={{
                    mt: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.7,
                    color: '#6B007B',
                }}
            >
                <InfoRoundedIcon sx={{fontSize: 15}}/>

                <Typography sx={{fontSize: 11}}>
                    {intl.formatMessage({id: 'prices.editor.helper'})}
                </Typography>
            </Box>
        </Box>
    );
};

export default TariffEditor;