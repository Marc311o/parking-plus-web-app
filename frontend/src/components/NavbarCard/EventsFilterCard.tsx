import {Box, Button, Checkbox, FormControlLabel, Paper, TextField, Typography} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {useIntl} from 'react-intl';
import {useState} from 'react';

const EventsFilterCard = () => {
    const {formatMessage} = useIntl();

    //TODO: implement search and filter functionality
    const [search, setSearch] = useState('');
    const [entryChecked, setEntryChecked] = useState(true);
    const [exitChecked, setExitChecked] = useState(true);

    return (
        <Paper
            elevation={0}
            sx={{
                height: 130,
                borderRadius: 1,
                bgcolor: 'background.paper',
                px: 4,
                py: 1.5,
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.75,
                }}
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: '1fr auto',
                        gap: 1.5,
                        alignItems: 'center',
                    }}
                >
                    <TextField
                        fullWidth
                        size="small"
                        placeholder={formatMessage({id: 'navbar.events.filters.searchPlaceholder'})}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        variant="outlined"
                        sx={{
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
                        }}
                    />

                    <Button
                        variant="contained"
                        startIcon={<SearchIcon/>}
                        sx={{
                            minWidth: 115,
                            height: 34,
                            borderRadius: 1.5,
                            textTransform: 'none',
                            fontSize: 13,
                            fontWeight: 600,
                            boxShadow: 'none',
                            background: 'linear-gradient(90deg, #C13BDB 0%, #8B1F9E 100%)',
                            '&:hover': {
                                boxShadow: 'none',
                                background: 'linear-gradient(90deg, #b232ca 0%, #7d1b8f 100%)',
                            },
                        }}
                    >
                        {formatMessage({id: 'navbar.events.filters.searchButton'})}
                    </Button>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        mt: 0,
                    }}
                >
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={entryChecked}
                                onChange={(e) => setEntryChecked(e.target.checked)}
                                size="small"
                                sx={{
                                    color: '#d0d0d4',
                                    p: 0.25,
                                    '&.Mui-checked': {
                                        color: 'primary.main',
                                    },
                                }}
                            />
                        }
                        label={
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: '#9a9aa1',
                                    lineHeight: 1.1,
                                }}
                            >
                                {formatMessage({id: 'navbar.events.filters.checkboxes.entries'})}
                            </Typography>
                        }
                        sx={{
                            m: 0,
                            minHeight: 24,
                            '& .MuiFormControlLabel-label': {
                                ml: 0.5,
                            },
                        }}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={exitChecked}
                                onChange={(e) => setExitChecked(e.target.checked)}
                                size="small"
                                sx={{
                                    color: '#d0d0d4',
                                    p: 0.25,
                                    '&.Mui-checked': {
                                        color: 'primary.main',
                                    },
                                }}
                            />
                        }
                        label={
                            <Typography
                                sx={{
                                    fontSize: 13,
                                    color: '#9a9aa1',
                                    lineHeight: 1.1,
                                }}
                            >
                                {formatMessage({id: 'navbar.events.filters.checkboxes.exits'})}
                            </Typography>
                        }
                        sx={{
                            m: 0,
                            minHeight: 24,
                            '& .MuiFormControlLabel-label': {
                                ml: 0.5,
                            },
                        }}
                    />
                </Box>
            </Box>
        </Paper>
    );
};

export default EventsFilterCard;