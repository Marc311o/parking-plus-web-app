import { useState } from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';

import enMessages from '@locales/en.json';
import plMessages from '@locales/pl.json';

const messages = {
  en: enMessages,
  pl: plMessages,
};

function App() {
  const [locale, setLocale] = useState('pl');

  return (
      <IntlProvider locale={locale} messages={messages[locale as keyof typeof messages]}>
        <div className="App">
          <h1>
            <FormattedMessage id="welcome_message" defaultMessage="Witaj!" />
          </h1>

          <select value={locale} onChange={(e) => setLocale(e.target.value)}>
            <option value="pl">Polskissss</option>
            <option value="en">English</option>
          </select>

          <p>
            <FormattedMessage
                id="description_text"
                defaultMessage="To jest przykładowy tekst."
            />
          </p>
        </div>
      </IntlProvider>
  );
}

export default App;