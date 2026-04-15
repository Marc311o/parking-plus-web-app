import {Box, Button, MenuItem, Paper, TextField} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import {useIntl} from 'react-intl';
import {useState} from 'react';

const ClientsFilterCard = () => {
    const {formatMessage} = useIntl();

    //TODO: implement search and sort functionality
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('');

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
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    columnGap: 1.5,
                    rowGap: 1,
                    alignItems: 'center',
                }}
            >
                <TextField
                    fullWidth
                    size="small"
                    placeholder={formatMessage({id: 'navbar.clients.filters.searchPlaceholder'})}
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
                        minWidth: 120,
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
                    {formatMessage({id: 'navbar.clients.filters.searchButton'})}
                </Button>

                <TextField
                    select
                    fullWidth
                    size="small"
                    label={formatMessage({id: 'navbar.clients.filters.sortLabel'})}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
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
                        '& .MuiInputLabel-root': {
                            fontSize: 13,
                        },
                        '& .MuiInputBase-input': {
                            fontSize: 13,
                            py: 0,
                        },
                    }}
                >
                    <MenuItem value="nameAsc">
                        {formatMessage({id: 'navbar.clients.filters.options.nameAsc'})}
                    </MenuItem>
                    <MenuItem value="nameDesc">
                        {formatMessage({id: 'navbar.clients.filters.options.nameDesc'})}
                    </MenuItem>
                    <MenuItem value="dateNewest">
                        {formatMessage({id: 'navbar.clients.filters.options.dateNewest'})}
                    </MenuItem>
                    <MenuItem value="dateOldest">
                        {formatMessage({id: 'navbar.clients.filters.options.dateOldest'})}
                    </MenuItem>
                </TextField>

                <Button
                    variant="contained"
                    startIcon={<FilterAltOutlinedIcon/>}
                    sx={{
                        minWidth: 120,
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
                    {formatMessage({id: 'navbar.clients.filters.sortButton'})}
                </Button>
            </Box>
        </Paper>
    );
};

export default ClientsFilterCard;