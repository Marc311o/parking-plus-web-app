import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Paper,
    TextField,
    Typography,
    Alert
} from '@mui/material';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';

import {useState} from 'react';
import {topUpBalance} from "@api/UserBalance";
import {useAuthStore} from "@store/useAuthStore";


interface Props {
    open: boolean;
    userId: number;
    token: string;
    onClose: () => void;
}

export default function UserBalanceDialog({
                                              open,
                                              userId,
                                              token,
                                              onClose,
                                          }: Props) {

    const [amount, setAmount] = useState('');

    const [error, setError] = useState('');

    const setUser = useAuthStore((state) => state.setUser);

    const handleTopUp = async () => {

        setError('');

        const normalizedAmount = amount.replace(',', '.');

        if (normalizedAmount.endsWith('.')) {
            setError('Enter a valid amount');
            return;
        }

        const parsedAmount = Number(normalizedAmount);

        if (
            Number.isNaN(parsedAmount) ||
            parsedAmount < 0.01
        ) {
            setError('Minimum top up amount is 0.01 PLN');
            return;
        }

        try {

            const updatedUser = await topUpBalance(userId, token, parsedAmount);
            setUser(updatedUser);

            onClose();

        } catch (error) {

            const message =
                error instanceof Error
                    ? error.message
                    : 'Top up failed';

            setError(message);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
        >
            <IconButton
                onClick={onClose}
                disableRipple
                sx={{
                    position: 'absolute',
                    top: 22,
                    right: 0,
                    zIndex: 2,
                    color: '#FFFFFF',
                    p: 0,
                    '&:hover': {
                        bgcolor: 'transparent',
                        opacity: 0.75,
                    },
                }}
            >
                <CloseRoundedIcon/>
            </IconButton>

            <DialogTitle
                sx={{
                    p: 0,
                    background: 'linear-gradient(135deg, #5E076E 0%, #C13BDB 100%)',
                    color: '#FFFFFF',
                }}
            >
                <Box
                    sx={{
                        p: 3,
                        pr: 7,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                    }}
                >
                    <Avatar
                        sx={{
                            width: 48,
                            height: 48,
                            bgcolor: 'rgba(255,255,255,0.18)',
                            color: '#FFFFFF',
                        }}
                    >
                        <AccountBalanceWalletRoundedIcon/>
                    </Avatar>

                    <Box>
                        <Typography
                            sx={{
                                fontSize: 18,
                                fontWeight: 800,
                            }}
                        >
                            Top up balance
                        </Typography>

                        <Typography
                            sx={{
                                fontSize: 13,
                                opacity: 0.85,
                            }}
                        >
                            Add funds to your account
                        </Typography>
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent
                sx={{
                    p: 0,
                    bgcolor: '#FBF7FC',
                }}
            >
                <Box sx={{p: 3}}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2.5,
                            borderRadius: '16px',
                            bgcolor: '#FFFFFF',
                            border: '1px solid rgba(139, 31, 158, 0.12)',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: 14,
                                fontWeight: 600,
                                mb: 1.5,
                            }}
                        >
                            Enter amount
                        </Typography>

                        {error && (
                            <Alert
                                severity="error"
                                sx={{
                                    mb: 2,
                                    width: '100%',
                                }}
                            >
                                {error}
                            </Alert>
                        )}

                        <TextField
                            fullWidth
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => {

                                const value = e.target.value;

                                const regex = /^\d*([.,]\d{0,2})?$/;

                                if (value === '' || regex.test(value)) {
                                    setAmount(value);
                                }
                            }}
                            inputProps={{
                                inputMode: 'decimal',
                            }}
                            sx={{
                                mb: 3,
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleTopUp}
                            sx={{
                                height: 44,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 700,
                                background:
                                    'linear-gradient(135deg, #5E076E 0%, #C13BDB 100%)',

                                '&:hover': {
                                    opacity: 0.92,
                                },
                            }}
                        >
                            Top up
                        </Button>
                    </Paper>
                </Box>
            </DialogContent>
        </Dialog>
    );
}