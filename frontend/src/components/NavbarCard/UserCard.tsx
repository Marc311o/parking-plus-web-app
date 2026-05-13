import {Box, Typography, Paper, Avatar} from '@mui/material';
import {useAuthStore} from "@store/useAuthStore";

const UserCard = () => {

    const user = useAuthStore((state) => state.user);

    if (!user) return null;

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
                    {user.name} {user.surname}
                </Typography>
                <Typography variant="caption" sx={{color: 'text.secondary', display: 'block'}}>
                    {user.email}
                </Typography>
            </Box>
        </Paper>
    );
};

export default UserCard;