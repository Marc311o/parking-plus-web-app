import {useState} from 'react';
import {useIntl, FormattedMessage} from 'react-intl';

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
} from '@mui/material';

const SettingsPage = () => {
    const [tab, setTab] = useState(0);

    const intl = useIntl();

    const locale = useLocaleStore((state) => state.locale);
    const setLocale = useLocaleStore((state) => state.setLocale);

    const user = useAuthStore((state) => state.user);

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
                elevation={2}
                sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                }}
            >
                <Tabs
                    value={tab}
                    onChange={(_, newValue) => setTab(newValue)}
                    variant="fullWidth"
                >
                    <Tab
                        label={<FormattedMessage id="settings.tabs_general" />}
                    />
                    <Tab
                        label={<FormattedMessage id="settings.tabs_account" />}
                    />
                </Tabs>

                <Box sx={{p: 4}}>
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
                            <MenuItem value="pl">
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <span style={{fontSize: 20}}>🇵🇱</span>
                                    <FormattedMessage id="settings.lang_pl" />
                                </Box>
                            </MenuItem>

                            <MenuItem value="en">
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <span style={{fontSize: 20}}>🇬🇧</span>
                                    <FormattedMessage id="settings.lang_en" />
                                </Box>
                            </MenuItem>
                        </TextField>
                    )}

                    {tab === 1 && (
                        <Stack spacing={3}>
                            <Typography variant="h6">
                                <FormattedMessage id="settings.account_title" />
                            </Typography>

                            <Divider />

                            <Stack spacing={1}>
                                <Typography variant="body2" color="text.secondary">
                                    <FormattedMessage id="settings.first_name" />
                                </Typography>
                                <Typography variant="body1">
                                    {user?.name || '-'}
                                </Typography>
                            </Stack>

                            <Stack spacing={1}>
                                <Typography variant="body2" color="text.secondary">
                                    <FormattedMessage id="settings.last_name" />
                                </Typography>
                                <Typography variant="body1">
                                    {user?.surname || '-'}
                                </Typography>
                            </Stack>

                            <Stack spacing={1}>
                                <Typography variant="body2" color="text.secondary">
                                    <FormattedMessage id="settings.email" />
                                </Typography>
                                <Typography variant="body1">
                                    {user?.email || '-'}
                                </Typography>
                            </Stack>
                        </Stack>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default SettingsPage;