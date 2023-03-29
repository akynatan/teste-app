import React, { useContext, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import './App.css';
import { AppContext } from './AppProvider';
import Auth from './components/Auth';
import Schedule from './components/Schedule';
import StatusIndicator from './components/StatusIndicator';

const App = () => {
  const { authenticate, isLoggedIn, isLoggingIn } = useContext(AppContext);

  const handleSignIn = async (data) => {
    try {
      await authenticate(data && data.token);
    } catch (err) {}
  };

  useEffect(() => {
    handleSignIn();
  }, []);

  return (
    <div className="App">
      {isLoggingIn ? (
        <StatusIndicator
          action={<FormattedMessage id="checking" />}
          subject={<FormattedMessage id="authentication" />}
          status="loading"
        />
      ) : isLoggedIn ? (
        <Schedule />
      ) : (
        <Auth onSignIn={handleSignIn} />
      )}
    </div>
  );
};

export default App;
