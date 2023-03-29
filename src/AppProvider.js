import React, { createContext, useEffect, useState } from 'react';
import { setAuthorization, setCurrentProfile } from './services/api';
import { fetchAccount, fetchChannels, fetchPages, fetchProfiles } from './services/CoreService';
import { setUserId } from './services/EventTracking';

const initialValue = {};

export const AppContext = createContext(initialValue);

export const AppProvider = ({ children }) => {
  const t = window.TrelloPowerUp.iframe();

  const [isFirstPost, setIsFirstPost] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoadingPages, setIsLoadingPages] = useState(false);

  const [token, setToken] = useState(null);
  const [account, setAccount] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [channelId, setChannelId] = useState(null);

  const [channels, setChannels] = useState([]);
  const [pages, setPages] = useState([]);
  const [profiles, setProfiles] = useState([]);

  const authenticate = async (token) => {
    try {
      setIsLoggingIn(true);

      if (!token) {
        token = await t.loadSecret('token');
      }

      setAuthorization(token);
      setToken(token);

      const accountData = await fetchAccount().then(({ data }) => ({
        id: data.data.id,
        name: data.data.attributes.name,
      }));

      const channelsData = await fetchChannels().then(({ data }) =>
        data.data.map((profile) => ({
          id: profile.id,
          name: profile.attributes.name,
        }))
      );

      const profilesData = await fetchProfiles().then(({ data }) =>
        data.data.map((profile) => ({
          id: profile.id,
          name: profile.attributes.name,
          image: profile.attributes['avatar-url'],
        }))
      );

      setAccount(accountData);
      setChannels(channelsData);
      setProfiles(profilesData);

      setIsLoggedIn(true);
      setIsLoggingIn(false);

      const firstPost = await t.get('member', 'private', 'first-post');
      setIsFirstPost(!firstPost);

      return token;
    } catch (err) {
      setIsLoggedIn(false);
      setIsLoggingIn(false);
    }
  };

  const registerFirstPost = async () => {
    await t.set('member', 'private', 'first-post', new Date().toISOString());
    await Promise.all([
      t.confetti(),
      t.confetti(),
      t.confetti(),
      t.confetti(),
      t.confetti(),
      t.confetti(),
    ]);
  };

  const getCurrentCard = () => t.card('all');

  const getStoredScheduleId = () =>
    t.get('card', 'shared', `profile-${profileId}-channel-${channelId}`);

  const storeScheduleId = (scheduleId) =>
    t.set('card', 'shared', `profile-${profileId}-channel-${channelId}`, scheduleId);

  const getAccountId = () => t.get('member', 'private', 'account-id');

  const storeAccountId = (accountId) => t.set('member', 'private', 'account-id', accountId);

  useEffect(() => {
    t.storeSecret('token', token);
    setAuthorization(token);
  }, [token]);

  const loadPagesByProfile = async () => {
    try {
      setIsLoadingPages(true);

      const pagesData = await fetchPages(profileId).then(({ data }) =>
        data.data.map((page) => ({
          id: page.id,
          name: page.attributes.name,
          image: page.attributes.image,
          channel: channels.find((channel) => channel.id === page.relationships.channel.data.id),
        }))
      );

      setPages(pagesData);
      setIsLoadingPages(false);
    } catch (err) {}
  };

  useEffect(() => {
    if (profileId) {
      setCurrentProfile(profileId);
      loadPagesByProfile();
    }
  }, [profileId]);

  useEffect(() => {
    setUserId(account && account.id);
    storeAccountId(account && account.id);
  }, [account]);

  const providerValue = {
    channels,
    pages,
    profiles,
    token,
    profileId,
    channelId,
    isLoggedIn,
    isLoggingIn,
    isLoadingPages,
    isFirstPost,
    storeScheduleId,
    getStoredScheduleId,
    setProfileId,
    setChannelId,
    authenticate,
    getCurrentCard,
    registerFirstPost,
  };

  return <AppContext.Provider value={providerValue}>{children}</AppContext.Provider>;
};
