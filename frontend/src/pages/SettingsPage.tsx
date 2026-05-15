// todo alert replace

import {useState} from 'react';
import {useIntl, FormattedMessage} from 'react-intl';

import { mfaSetup, mfaConfirm, fetchUserData } from '@api/Login/auth';
import {useLocaleStore} from '@store/useLocaleStore';
import {useAuthStore} from '@store/useAuthStore';

import {
    Box,
    Tabs,
    Tab,
    Paper,
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


    const [mfaStep, setMfaStep] = useState<
        'idle' | 'setup' | 'confirm' | 'enabled'
    >('idle');

    const [otpCode, setOtpCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [mfaSecret, setMfaSecret] = useState<string | null>(null);
    const [mfaError, setMfaError] = useState<string | null>(null);

    const handleMfaSetup = async () => {
        if (!user || !token) return;

        setMfaError(null);
        setLoading(true);

        try {
            const data = await mfaSetup(token, user.id);

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

        try {
            await mfaConfirm(token, user.id, user.email, otpCode);

            const refreshedUser = await fetchUserData(token);

            useAuthStore.setState({
                user: refreshedUser,
            });

            setMfaStep('enabled');
            setOtpCode('');
            alert("success!"); // todo
        } catch (e: any) {
            alert(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                width: '100%',
                minHeight: '100vh',
                p: 3,
                boxSizing: 'border-box',
            }}
        >
            <Paper
                sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 3,
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
                >
                    <Tab label={<FormattedMessage id="settings.tabs_general" />} />
                    <Tab label={<FormattedMessage id="settings.tabs_account" />} />
                </Tabs>

                <Box sx={{p: 4}}>
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
                                <strong>{intl.formatMessage({ id: 'settings.first_name' })}:</strong>{' '}
                                {user?.name || '-'}
                            </Typography>

                            <Typography>
                                <strong>{intl.formatMessage({ id: 'settings.last_name' })}:</strong>{' '}
                                {user?.surname || '-'}
                            </Typography>

                            <Typography>
                                <strong>{intl.formatMessage({ id: 'settings.email' })}:</strong>{' '}
                                {user?.email || '-'}
                            </Typography>

                            <Divider />

                            {/* ================= MFA ================= */}
                            <Stack spacing={2}>
                                <Typography variant="h6">
                                    {intl.formatMessage({ id: 'settings.mfa.title'})}
                                </Typography>

                                {/* IDLE */}
                                {mfaStep === 'idle' && (
                                    <Stack spacing={2}>
                                        {user?.mfaEnabled ? (
                                            <Typography color="success.main">
                                                {intl.formatMessage({ id: 'settings.mfa.already_enabled'})}
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
                                                >
                                                    {intl.formatMessage({ id: 'settings.mfa.enable'})}
                                                </Button>
                                            </>
                                        )}
                                    </Stack>
                                )}

                                {/* SETUP */}
                                {mfaStep === 'setup' && (
                                    <Stack spacing={2}>
                                        <Typography variant="body2">
                                            {intl.formatMessage({ id: 'settings.mfa.setup_mfa'})}
                                        </Typography>

                                        <Typography variant="caption">
                                            {intl.formatMessage({ id: 'settings.mfa.secret'})}: {mfaSecret}
                                        </Typography>

                                        <Button
                                            variant="outlined"
                                            onClick={() =>
                                                setMfaStep('confirm')
                                            }
                                        >
                                            {intl.formatMessage({ id: 'settings.mfa.next'})}
                                        </Button>
                                    </Stack>
                                )}

                                {/* CONFIRM */}
                                {mfaStep === 'confirm' && (
                                    <Stack spacing={2}>
                                        <TextField
                                            label={intl.formatMessage({ id: 'settings.mfa.code_label'})}
                                            value={otpCode}
                                            onChange={(e) =>
                                                setOtpCode(e.target.value)
                                            }
                                            fullWidth
                                        />

                                        <Box sx={{display: 'flex', gap: 2}}>
                                            <Button
                                                variant="contained"
                                                onClick={handleMfaConfirm}
                                                disabled={loading}
                                            >
                                                {intl.formatMessage({ id: 'settings.mfa.confirm'})}
                                            </Button>

                                            <Button
                                                onClick={() => {
                                                    setMfaStep('idle');
                                                    setOtpCode('');
                                                    setMfaSecret(null);
                                                    setMfaError(null);
                                                }}
                                            >
                                                {intl.formatMessage({ id: 'settings.mfa.cancel'})}
                                            </Button>
                                        </Box>
                                    </Stack>
                                )}

                                {/* ENABLED */}
                                {mfaStep === 'enabled' && (
                                    <Typography color="success.main">
                                        {intl.formatMessage({ id: 'settings.mfa.enabled'})}
                                    </Typography>
                                )}
                            </Stack>
                        </Stack>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default SettingsPage;