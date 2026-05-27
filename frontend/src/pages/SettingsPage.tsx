import {useState, useEffect} from 'react';
import {useIntl, FormattedMessage} from 'react-intl';

import {mfaSetup, mfaConfirm, fetchUserData} from '@api/Login/auth';
import {useLocaleStore} from '@store/useLocaleStore';
import {useAuthStore} from '@store/useAuthStore';

import {
    Alert,
    Box,
    Tabs,
    Tab,
    Typography,
    Stack,
    Divider,
    TextField,
    MenuItem,
    Button,
} from '@mui/material';

const SettingsPage = () => {
    const [tab, setTab] = useState(0);

    const intl = useIntl();

    const locale = useLocaleStore((state) => state.locale);
    const setLocale = useLocaleStore((state) => state.setLocale);

    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    const [otpError, setOtpError] = useState<string | null>(null);
    const [verifySuccess, setVerifySuccess] = useState<string | null>(null);

    const resetMfaState = () => {
        setOtpCode('');
        setMfaSecret(null);
        setMfaError(null);
        setVerifySuccess(null);
    };


    const [mfaStep, setMfaStep] = useState<
        'idle' | 'setup' | 'confirm' | 'enabled'
    >('idle');

    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [mfaSecret, setMfaSecret] = useState<string | null>(null);
    const [mfaError, setMfaError] = useState<string | null>(null);

    const primaryButtonSx = {
        minWidth: 120,
        height: 34,
        borderRadius: 1.5,
        textTransform: 'none',
        fontSize: 13,
        fontWeight: 600,
        boxShadow: 'none',
        color: '#FFFFFF',
        background: 'linear-gradient(90deg, #C13BDB 0%, #8B1F9E 100%)',
        transition: 'all 0.2s ease',

        '&:hover': {
            boxShadow: 'none',
            background: 'linear-gradient(90deg, #b232ca 0%, #7d1b8f 100%)',
        },

        '&.Mui-disabled': {
            color: '#9E9E9E',
            background: 'linear-gradient(90deg, #E5E5E5 0%, #CFCFCF 100%)',
        },
    };

    useEffect(() => {
        return () => {
            resetMfaState();
        };
    }, []);

    useEffect(() => {
        if (mfaStep === 'confirm') {
            setOtpError(null);
        }
    }, [mfaStep]);

    const handleMfaSetup = async () => {
        if (!user || !token) return;

        setMfaError(null);
        setLoading(true);

        try {
            const data = await mfaSetup(token, Number(user.id));

            setMfaSecret(data.secret || null);
            setMfaStep('setup');
        } catch (e: any) {
            setMfaError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMfaConfirm = async () => {
        if (!user || !token) return;

        setLoading(true);
        setOtpError(null);

        try {
            await mfaConfirm(token, Number(user.id), user.email, otpCode);

            const refreshedUser = await fetchUserData(token);

            useAuthStore.setState({
                user: refreshedUser,
            });

            setMfaStep('enabled');
            setOtpCode('');
            setVerifySuccess(
                intl.formatMessage({
                    id: 'settings.mfa.success',
                })
            );


        } catch (e: any) {
            setOtpError(
                intl.formatMessage({
                    id: 'settings.mfa.invalid_code',
                })
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                p: 3,
                boxSizing: 'border-box',
                overflow: 'hidden',
            }}
        >
            <Tabs
                value={tab}
                onChange={(_, v) => {
                    setTab(v);
                    setMfaError(null);
                }}
                variant="fullWidth"
                sx={{
                    mb: 3,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Tab label={<FormattedMessage id="settings.tabs_general" />} />
                <Tab label={<FormattedMessage id="settings.tabs_account" />} />
            </Tabs>

            <Box sx={{ width: '100%' }}>
                {/* ================= GENERAL ================= */}
                {tab === 0 && (
                    <TextField
                        select
                        fullWidth
                        label={intl.formatMessage({
                            id: 'settings.language',
                        })}
                        value={locale}
                        onChange={(e) =>
                            setLocale(e.target.value as 'pl' | 'en')
                        }
                    >
                        <MenuItem value="pl">🇵🇱 Polski</MenuItem>
                        <MenuItem value="en">🇬🇧 English</MenuItem>
                    </TextField>
                )}

                {/* ================= ACCOUNT ================= */}
                    {tab === 1 && (
                        <Stack spacing={3}>

                            <Typography>
                                <strong>{intl.formatMessage({id: 'settings.first_name'})}:</strong>{' '}
                                {user?.name || '-'}
                            </Typography>

                            <Typography>
                                <strong>{intl.formatMessage({id: 'settings.last_name'})}:</strong>{' '}
                                {user?.surname || '-'}
                            </Typography>

                            <Typography>
                                <strong>{intl.formatMessage({id: 'settings.email'})}:</strong>{' '}
                                {user?.email || '-'}
                            </Typography>

                            <Divider/>

                            {/* ================= MFA ================= */}
                            <Stack spacing={2}>
                                <Typography variant="h6">
                                    {intl.formatMessage({id: 'settings.mfa.title'})}
                                </Typography>

                                {/* IDLE */}
                                {mfaStep === 'idle' && (
                                    <Stack spacing={2}>
                                        {user?.isMfaEnabled ? (
                                            <Typography color="success.main">
                                                {intl.formatMessage({id: 'settings.mfa.already_enabled'})}
                                            </Typography>
                                        ) : (
                                            <>
                                                {mfaError && (
                                                    <Typography color="error">
                                                        {mfaError}
                                                    </Typography>
                                                )}

                                                <Button
                                                    variant="contained"
                                                    onClick={handleMfaSetup}
                                                    disabled={loading}
                                                    sx={primaryButtonSx}
                                                >
                                                    {intl.formatMessage({id: 'settings.mfa.enable'})}
                                                </Button>
                                            </>
                                        )}
                                    </Stack>
                                )}

                                {/* SETUP */}
                                {mfaStep === 'setup' && (
                                    <Stack spacing={2}>
                                        <Typography variant="body2">
                                            {intl.formatMessage({id: 'settings.mfa.setup_mfa'})}
                                        </Typography>

                                        <Typography variant="caption">
                                            {intl.formatMessage({id: 'settings.mfa.secret'})}: {mfaSecret}
                                        </Typography>

                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                setMfaStep('confirm')
                                            }
                                            sx={primaryButtonSx}
                                        >
                                            {intl.formatMessage({id: 'settings.mfa.next'})}
                                        </Button>
                                    </Stack>
                                )}

                                {/* CONFIRM */}
                                {mfaStep === 'confirm' && (
                                    <Stack spacing={2}>
                                        <TextField
                                            label={intl.formatMessage({id: 'settings.mfa.code_label'})}
                                            value={otpCode}
                                            onChange={(e) =>
                                                setOtpCode(e.target.value)
                                            }
                                            fullWidth
                                        />

                                        {verifySuccess && (
                                            <Alert severity="success" sx={{width: "100%"}}>
                                                {verifySuccess}
                                            </Alert>
                                        )}

                                        {otpError && (
                                            <Alert severity="error" sx={{width: "100%"}}>
                                                {otpError}
                                            </Alert>
                                        )}

                                        <Box sx={{display: 'flex', gap: 2}}>
                                            <Button
                                                variant="contained"
                                                onClick={handleMfaConfirm}
                                                disabled={loading}
                                                sx={primaryButtonSx}
                                            >
                                                {intl.formatMessage({id: 'settings.mfa.confirm'})}
                                            </Button>

                                            <Button
                                                onClick={() => {
                                                    setMfaStep('idle');
                                                    resetMfaState();
                                                }}
                                                sx={primaryButtonSx}
                                            >
                                                {intl.formatMessage({id: 'settings.mfa.cancel'})}
                                            </Button>
                                        </Box>
                                    </Stack>
                                )}

                                {/* ENABLED */}
                                {mfaStep === 'enabled' && (
                                    <Typography color="success.main">
                                        {intl.formatMessage({id: 'settings.mfa.enabled'})}
                                    </Typography>
                                )}
                            </Stack>
                        </Stack>
                    )}
                </Box>
        </Box>
    );
};

export default SettingsPage;