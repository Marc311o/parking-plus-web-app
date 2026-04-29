import {BrowserRouter} from 'react-router-dom';
import {IntlProvider} from 'react-intl';
import {CssBaseline, ThemeProvider} from '@mui/material';
import AppRoutes from './AppRoutes';
import theme from './theme';

import enMessages from '@locales/en.json';
import plMessages from '@locales/pl.json';

type Messages = Record<string, string | Messages>;

const flattenMessages = (
    messages: Messages,
    prefix = ''
): Record<string, string> => {
    return Object.keys(messages).reduce<Record<string, string>>((acc, key) => {
        const value = messages[key];
        const prefixedKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'string') {
            acc[prefixedKey] = value;
        } else if (value && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(acc, flattenMessages(value, prefixedKey));
        }

        return acc;
    }, {});
};

const rawMessages = {en: enMessages, pl: plMessages};

function App() {
    const locale = 'en';

    const messages = flattenMessages(
        rawMessages[locale as keyof typeof rawMessages] as Messages
    );

    return (
        <IntlProvider locale={locale} messages={messages}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <BrowserRouter>
                    <AppRoutes/>
                </BrowserRouter>
            </ThemeProvider>
        </IntlProvider>
    );
}

export default App;