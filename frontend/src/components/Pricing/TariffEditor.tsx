import {Box, TextField, Typography, MenuItem} from '@mui/material';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import {useIntl} from 'react-intl';

const DAYS = [
    {value: 1, id: 'prices.schedule.days.mondayShort'},
    {value: 2, id: 'prices.schedule.days.tuesdayShort'},
    {value: 3, id: 'prices.schedule.days.wednesdayShort'},
    {value: 4, id: 'prices.schedule.days.thursdayShort'},
    {value: 5, id: 'prices.schedule.days.fridayShort'},
    {value: 6, id: 'prices.schedule.days.saturdayShort'},
    {value: 7, id: 'prices.schedule.days.sundayShort'},
];

const HOURS = Array.from({length: 25}, (_, i) => i);

type TariffEditorProps = {
    view: 'hourly' | 'daily';
    firstHourPrice: string;
    nextHourPrice: string;
    startHour: number;
    endHour: number;
    selectedDay: number;
    onChange: (field: string, value: any) => void;
};

const TariffEditor = ({
                          view,
                          firstHourPrice,
                          nextHourPrice,
                          startHour,
                          endHour,
                          selectedDay,
                          onChange,
                      }: TariffEditorProps) => {
    const intl = useIntl();

    const isHourly = view === 'hourly';

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                width: 280,
            }}
        >
            <Typography
                sx={{
                    color: '#6B007B',
                    fontSize: 16,
                    fontWeight: 700,
                    mb: 0.5,
                }}
            >
                {intl.formatMessage({id: 'prices.editor.editTitle'})}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    select
                    label={intl.formatMessage({id: 'prices.editor.dayLabel'})}
                    value={selectedDay}
                    onChange={(e) => onChange('selectedDay', Number(e.target.value))}
                    size="small"
                    fullWidth
                >
                    {DAYS.map((day) => (
                        <MenuItem key={day.value} value={day.value}>
                            {intl.formatMessage({id: day.id})}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            {isHourly && (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        select
                        label={intl.formatMessage({id: 'prices.editor.startHourLabel'})}
                        value={startHour}
                        onChange={(e) => onChange('startHour', Number(e.target.value))}
                        size="small"
                        fullWidth
                    >
                        {HOURS.slice(0, 24).map((h) => (
                            <MenuItem key={h} value={h}>
                                {String(h).padStart(2, '0')}:00
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        label={intl.formatMessage({id: 'prices.editor.endHourLabel'})}
                        value={endHour}
                        onChange={(e) => onChange('endHour', Number(e.target.value))}
                        size="small"
                        fullWidth
                    >
                        {HOURS.slice(1).map((h) => (
                            <MenuItem key={h} value={h}>
                                {h === 24 ? '24:00' : `${String(h).padStart(2, '0')}:00`}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            )}

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 70px 30px',
                    gap: 1,
                    alignItems: 'center',
                }}
            >
                {view === 'daily' ? (
                    <>
                        <Typography sx={{ color: '#6B007B', fontSize: 13 }}>
                            {intl.formatMessage({id: 'prices.editor.dailyPriceLabel'})}
                        </Typography>
                        <TextField
                            size="small"
                            value={firstHourPrice}
                            onChange={(e) => onChange('firstHourPrice', e.target.value)}
                            inputProps={{ style: { textAlign: 'center', fontSize: 13, padding: '6px' } }}
                        />
                        <Typography sx={{ color: '#6B007B', fontSize: 13 }}>
                            {intl.formatMessage({id: 'prices.editor.currencyShort'})}
                        </Typography>
                    </>
                ) : (
                    <>
                        <Typography sx={{ color: '#6B007B', fontSize: 13 }}>
                            {intl.formatMessage({id: 'prices.editor.firstHourLabel'})}
                        </Typography>
                        <TextField
                            size="small"
                            value={firstHourPrice}
                            onChange={(e) => onChange('firstHourPrice', e.target.value)}
                            inputProps={{ style: { textAlign: 'center', fontSize: 13, padding: '6px' } }}
                        />
                        <Typography sx={{ color: '#6B007B', fontSize: 13 }}>
                            {intl.formatMessage({id: 'prices.editor.currencyShort'})}
                        </Typography>

                        <Typography sx={{ color: '#6B007B', fontSize: 13 }}>
                            {intl.formatMessage({id: 'prices.editor.nextHourLabel'})}
                        </Typography>
                        <TextField
                            size="small"
                            value={nextHourPrice}
                            onChange={(e) => onChange('nextHourPrice', e.target.value)}
                            inputProps={{ style: { textAlign: 'center', fontSize: 13, padding: '6px' } }}
                        />
                        <Typography sx={{ color: '#6B007B', fontSize: 13 }}>
                            {intl.formatMessage({id: 'prices.editor.currencyShort'})}
                        </Typography>
                    </>
                )}
            </Box>

            <Box
                sx={{
                    mt: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: '#6B007B',
                    opacity: 0.7,
                }}
            >
                <InfoRoundedIcon sx={{fontSize: 16}}/>
                <Typography sx={{fontSize: 11}}>
                    {intl.formatMessage({id: 'prices.editor.helper'})}
                </Typography>
            </Box>
        </Box>
    );
};

export default TariffEditor;