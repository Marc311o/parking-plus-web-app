import {
    Box,
    Paper,
    TextField,
    Typography,
    Checkbox,
    Snackbar,
    Alert,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import {useIntl} from 'react-intl';
import {useState} from 'react';

interface DateFilterCardProps {
    startDate: string;
    endDate: string;
    showAll: boolean;

    onStartDateChange: (value: string) => void;
    onEndDateChange: (value: string) => void;
    onShowAllChange: (value: boolean) => void;
}

const DateFilterCard = ({
                            startDate,
                            endDate,
                            showAll,
                            onStartDateChange,
                            onEndDateChange,
                            onShowAllChange,
                        }: DateFilterCardProps) => {
    const {formatMessage} = useIntl();

    const [errorOpen, setErrorOpen] = useState(false);

    const showError = () => setErrorOpen(true);

    const inputSx = {
        '& .MuiOutlinedInput-root': {
            height: 34,
            borderRadius: 1.5,
            bgcolor: '#fafafa',
            '& fieldset': {
                borderColor: '#e6e6ea',
            },
            '&:hover fieldset': {
                borderColor: '#d7d7dd',
            },
            '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
            },
        },
        '& .MuiInputBase-input': {
            fontSize: 13,
            py: 0,
        },
    };

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 1,
                    bgcolor: 'background.paper',
                    px: 4,
                    py: 2.5,
                    boxSizing: 'border-box',
                    height: '100%',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    {/* DATE INPUTS */}
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto 1fr',
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            type="date"
                            fullWidth
                            size="small"
                            disabled={showAll}
                            value={startDate}
                            onChange={(e) => {
                                const value = e.target.value;

                                if (endDate && value > endDate) {
                                    showError();
                                    return;
                                }

                                onStartDateChange(value);
                            }}
                            InputLabelProps={{shrink: true}}
                            sx={inputSx}
                        />

                        <ArrowForwardIcon
                            sx={{
                                fontSize: 18,
                                color: '#9a9aa1',
                            }}
                        />

                        <TextField
                            type="date"
                            fullWidth
                            size="small"
                            disabled={showAll}
                            value={endDate}
                            onChange={(e) => {
                                const value = e.target.value;

                                if (startDate && value < startDate) {
                                    showError();
                                    return;
                                }

                                onEndDateChange(value);
                            }}
                            InputLabelProps={{shrink: true}}
                            sx={inputSx}
                        />
                    </Box>

                    {/* SHOW ALL CHECKBOX */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                        }}
                        onClick={() => onShowAllChange(!showAll)}
                    >
                        <Checkbox
                            checked={showAll}
                            size="small"
                            sx={{
                                p: 0,
                                color: '#c4c4c9',
                                '&.Mui-checked': {
                                    color: 'primary.main',
                                },
                            }}
                        />

                        <Typography
                            sx={{
                                fontSize: 13,
                                color: '#9a9aa1',
                                lineHeight: 1.2,
                                userSelect: 'none',
                            }}
                        >
                            {formatMessage({
                                id: 'navbar.reservations.filters.showAll',
                            })}
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* SNACKBAR */}
            <Snackbar
                open={errorOpen}
                autoHideDuration={2500}
                onClose={() => setErrorOpen(false)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() => setErrorOpen(false)}
                >
                    {formatMessage({
                        id: 'navbar.reservations.filters.invalidDateRange',
                    })}
                </Alert>
            </Snackbar>
        </>
    );
};

export default DateFilterCard;