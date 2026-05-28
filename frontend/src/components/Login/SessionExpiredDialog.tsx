import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box} from '@mui/material';
import {useAuthStore} from '@store/useAuthStore';
import {useIntl} from 'react-intl';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';

const SessionExpiredDialog = () => {
    const {sessionExpired, logout, setSessionExpired} = useAuthStore();
    const {formatMessage} = useIntl();

    if (!sessionExpired) return null;

    const handleLoginRedirect = () => {
        logout();
        setSessionExpired(false);
        window.location.href = '/login';
    };

    return (
        <Dialog 
            open={sessionExpired} 
            onClose={() => {}} // Prevent closing by clicking outside
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: '16px', p: 1 }
            }}
        >
            <DialogContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <ErrorOutlineRoundedIcon sx={{ fontSize: 64, color: '#D32F2F' }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#111111' }}>
                    {formatMessage({ id: 'auth.sessionExpired.title', defaultMessage: 'Sesja wygasła' })}
                </Typography>
                <Typography sx={{ color: '#6B7280' }}>
                    {formatMessage({ 
                        id: 'auth.sessionExpired.description', 
                        defaultMessage: 'Twoja sesja wygasła. Zaloguj się ponownie, aby kontynuować.' 
                    })}
                </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 3, px: 3 }}>
                <Button 
                    onClick={handleLoginRedirect}
                    variant="contained"
                    fullWidth
                    sx={{
                        bgcolor: '#5E076E',
                        borderRadius: '12px',
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#4A0558' }
                    }}
                >
                    {formatMessage({ id: 'auth.sessionExpired.button', defaultMessage: 'Powrót do logowania' })}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SessionExpiredDialog;