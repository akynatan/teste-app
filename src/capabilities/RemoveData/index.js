import { setUserId } from '../../services/EventTracking';

const RemoveData = async (t) => {
  await t.clearSecret('token');
  await t.set('member', 'private', 'account-id', '');

  setUserId(null);
};

export default RemoveData;
