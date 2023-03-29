import { setUserId, trackPowerUpActivated } from '../../services/EventTracking';

const onEnable = async (t) => {
  const accountId = await t.get('member', 'private', 'account-id');

  setUserId(accountId);

  trackPowerUpActivated();
};

export default onEnable;
