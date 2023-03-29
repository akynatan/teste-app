import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { IntlProvider } from 'react-intl';
import App from './App';
import { AppProvider } from './AppProvider';
import translations from './translations/translations.json';

render(
  <IntlProvider locale={navigator.language} messages={translations[navigator.language]}>
    <AppProvider>
      <App />
    </AppProvider>
  </IntlProvider>,
  document.getElementById('root')
);
