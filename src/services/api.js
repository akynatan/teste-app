import axios from 'axios';
import { CORE_URL, FILES_URL, POST_URL } from '../config';

const defaultHeaders = {
  'Accept-Version': 'v1',
  'Content-Type': 'application/vnd.api+json',
};

export const authApi = axios.create({
  baseURL: CORE_URL,
});

export const coreApi = axios.create({
  baseURL: CORE_URL,
  headers: defaultHeaders,
});

export const postApi = axios.create({
  baseURL: POST_URL,
  headers: defaultHeaders,
});

export const filesApi = axios.create({
  baseURL: FILES_URL,
  headers: {
    Origin: window.location.hostname,
  },
});

export const setAuthorization = (token) => {
  [coreApi, postApi].forEach((api) => {
    api.defaults.headers.common = {
      ...api.defaults.headers.common,
      Authorization: 'Bearer ' + token,
    };
  });
};

export const setCurrentProfile = (currentProfile) => {
  [coreApi, postApi].forEach((api) => {
    api.defaults.headers.common = {
      ...api.defaults.headers.common,
      'Current-Profile': currentProfile,
    };
  });
};
