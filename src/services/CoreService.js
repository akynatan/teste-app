import { authApi, coreApi } from './api';

export const signIn = async ({ email, password }) => {
  return authApi.post('/v1/accounts/sign_in', {
    email,
    password,
    callback_url: 'https://mlabs.com.br',
  });
};

export const fetchAccount = async () => {
  return coreApi.get('/me');
};

export const fetchProfiles = async () => {
  return coreApi.get('/profiles');
};

export const fetchPages = async (profileId) => {
  return coreApi.get(`/pages?ids=${profileId}`);
};

export const fetchChannels = async () => {
  return coreApi.get('/channels');
};
