import {Box, Typography, Paper, Avatar, IconButton} from '@mui/material';
import {useAuthStore} from "@store/useAuthStore";
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import {useState} from 'react';
import UserBalanceDialog from "@components/UserBalance/UserBalanceDialog";



const UserCard = () => {

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const user = useAuthStore((state) => state.user);

    if (!user) return null;

    return (
        <>
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
                    <Box
                        sx={{
                            py: 0,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.2,
                            minWidth: 150,
                        }}
                    >

                        <IconButton
                            onClick={() => setIsDialogOpen(true)}
                            size="small"
                            sx={{
                                color: '#8B1F9E',
                            }}
                        >
                            <AddRoundedIcon fontSize="small"/>
                        </IconButton>

                        <Box>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 700,
                                    mt: 0.3,
                                }}
                            >
                                {user.balance.toFixed(2)} PLN
                            </Typography>
                        </Box>

                    </Box>
                </Box>
            </Paper>

            <UserBalanceDialog
                open={isDialogOpen}
                userId={Number(user.id)}
                onClose={() => setIsDialogOpen(false)}
            />
        </>
    );
};

export default UserCard;