import { setUserId, trackPowerUpDeactivated } from '../../services/EventTracking';

const onDisable = async (t) => {
  const accountId = await t.get('member', 'private', 'account-id');

  setUserId(accountId);

  await trackPowerUpDeactivated();
};

export default onDisable;
