import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { signIn } from '../../services/CoreService';
import { trackPowerUpLoginError, trackPowerUpLoginSuccess } from '../../services/EventTracking';

const Auth = ({ onSignIn }) => {
  const [authStatus, setAuthStatus] = useState({
    error: false,
    loading: false,
  });

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (key) => (e) => {
    setAuthStatus({ error: false, loading: false });
    setCredentials({ ...credentials, [key]: e.target.value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setAuthStatus({ error: false, loading: true });

      const auth = await signIn(credentials);

      if (auth && auth.data && auth.data.token) {
        onSignIn(auth.data);
        await trackPowerUpLoginSuccess();
      } else {
        setAuthStatus({ error: true, loading: false });
      }
    } catch (err) {
      setAuthStatus({ error: true, loading: false });
      await trackPowerUpLoginError();
    }
  };

  return (
    <div className="AuthScreen" onSubmit={handleSubmit}>
      <form className="Form">
        <div className="form-group">
          <label htmlFor="mLabsEmail" className="Label">
            E-mail
          </label>
          <input
            id="mLabsEmail"
            className={`Input ${authStatus.error ? 'is-error' : ''}`}
            disabled={authStatus.loading}
            onChange={handleChange('email')}
          />
        </div>
        <div className="form-group">
          <label htmlFor="mLabsPassword" className="Label">
            <FormattedMessage id="password" />
          </label>
          <input
            id="mLabsPassword"
            className={`Input ${authStatus.error ? 'is-error' : ''}`}
            type="password"
            disabled={authStatus.loading}
            onChange={handleChange('password')}
          />
        </div>
        <button
          className={`Button ${authStatus.error ? 'mod-danger' : 'mod-primary'}`}
          disabled={authStatus.loading}
        >
          {authStatus.error ? (
            <FormattedMessage id="authentication_error" />
          ) : authStatus.loading ? (
            <FormattedMessage id="authenticating" />
          ) : (
            <FormattedMessage id="authenticate" />
          )}
        </button>
      </form>
    </div>
  );
};

export default Auth;
