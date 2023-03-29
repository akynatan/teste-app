import amplitude from 'amplitude-js';

amplitude.getInstance().init(process.env.AMPLITUDE_KEY);

const logEvent = (...args) => {
  amplitude.getInstance().logEvent(...args);
};

export const setUserId = (userId) => {
  amplitude.getInstance().init(process.env.AMPLITUDE_KEY, userId);
};

export const setProperties = (properties) => {
  amplitude.getInstance().setUserProperties(properties);
};

export const trackPowerUpActivated = () =>
  logEvent('trello_power_up_activated', {
    trello_power_up_action: 'added',
  });

export const trackPowerUpDeactivated = () =>
  logEvent('trello_power_up_activated', {
    trello_power_up_action: 'removed',
  });

export const trackPowerUpCardModalOpened = () => logEvent('trello_power_up_card_modal_opened');

export const trackPowerUpCardModalClosed = () =>
  logEvent('trello_power_up_card_modal_opened', {
    trello_power_up_action: 'closed',
  });

export const trackPowerUpCardModalClosedButton = () =>
  logEvent('trello_power_up_card_modal_closed');

export const trackPowerUpLoginSuccess = () =>
  logEvent('trello_power_up_login', {
    trello_power_up_return_messages: 'success',
  });

export const trackPowerUpLoginError = () =>
  logEvent('trello_power_up_login', {
    trello_power_up_return_messages: 'error',
  });

export const trackPowerUpSelectProfile = (profile) => logEvent('trello_power_up_select_profile');

export const trackPowerUpSelectChannel = (channel) =>
  logEvent('trello_power_up_select_channel', {
    trello_power_up_selected_channel: channel,
  });

export const trackPowerUpDraftScheduleCreated = () =>
  logEvent('trello_power_up_draft_schedule', {
    trello_power_up_return_messages: 'created',
  });

export const trackPowerUpDraftScheduleUpdated = () =>
  logEvent('trello_power_up_draft_schedule', {
    trello_power_up_return_messages: 'updated',
  });

export const trackPowerUpDraftScheduleError = () =>
  logEvent('trello_power_up_draft_schedule', {
    trello_power_up_return_messages: 'error',
  });

export const trackPowerUpLink = () => logEvent('trello_power_up_mlabs_link');

export const trackPowerUpTryAgain = () => logEvent('trello_power_up_mlabs_try_again');

export const trackPowerUpRequired = () => logEvent('trello_power_up_mlabs_required');
