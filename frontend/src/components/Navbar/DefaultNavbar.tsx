import {Box, Paper, Typography} from '@mui/material';

const DefaultNavbar = () => {
    return (
        <Box sx={{px: 3}}>
            <Paper
                elevation={0}
                sx={{
                    minHeight: 113,
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    px: 3,
                    bgcolor: 'background.paper',
                }}
            >
                <Typography variant="h6">Default navbar</Typography>
            </Paper>
        </Box>
    );
};

export default DefaultNavbar;