import {Box, Typography, Paper, Avatar} from '@mui/material';

//TODO: AFTER USEAUTHSTORE WILL BE CREATED, THIS COMPONENT SHOULD BE UPDATED TO SHOW THE REAL USER DATA
const UserCard = () => {
    return (
        <Paper
            elevation={0}
            sx={{
                minHeight: 130,
                px: 2.5,
                py: 2,
                borderRadius: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
            }}
        >
            <Avatar sx={{width: 56, height: 56, bgcolor: '#dfdfe2'}}/>
            <Box sx={{minWidth: 0}}>
                <Typography variant="body2" sx={{fontWeight: 700, color: 'text.primary'}}>
                    Operator Test
                </Typography>
                <Typography variant="caption" sx={{color: 'text.secondary', display: 'block'}}>
                    operator.test@gmail.com
                </Typography>
            </Box>
        </Paper>
    );
};

export default UserCard;