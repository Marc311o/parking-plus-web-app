import {Box, Button, MenuItem, Paper, TextField} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import {useIntl} from 'react-intl';
import {useEffect, useState} from 'react';

interface ClientsFilterCardProps {
    search: string;
    sortBy: string;
    onSearchChange: (value: string) => void;
    onSortChange: (value: string) => void;
}

const ClientsFilterCard = ({
                               search,
                               sortBy,
                               onSearchChange,
                               onSortChange,
                           }: ClientsFilterCardProps) => {
    const {formatMessage} = useIntl();

    const [localSearch, setLocalSearch] = useState(search);
    const [localSortBy, setLocalSortBy] = useState(sortBy || 'nameAsc');

    useEffect(() => {
        setLocalSearch(search);
    }, [search]);

    useEffect(() => {
        setLocalSortBy(sortBy || 'nameAsc');
    }, [sortBy]);

    const handleSearchSubmit = () => {
        onSearchChange(localSearch);
    };

    const handleSortSubmit = () => {
        onSortChange(localSortBy);
    };

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
                    value={localSearch}
                    onChange={(event) => setLocalSearch(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                            handleSearchSubmit();
                        }
                    }}
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
                    onClick={handleSearchSubmit}
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
                    value={localSortBy}
                    onChange={(event) => setLocalSortBy(event.target.value)}
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
                    <MenuItem value="emailAsc">
                        {formatMessage({id: 'navbar.clients.filters.options.emailAsc'})}
                    </MenuItem>
                    <MenuItem value="emailDesc">
                        {formatMessage({id: 'navbar.clients.filters.options.emailDesc'})}
                    </MenuItem>
                </TextField>

                <Button
                    variant="contained"
                    startIcon={<FilterAltOutlinedIcon/>}
                    onClick={handleSortSubmit}
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