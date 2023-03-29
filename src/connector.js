import cardButtons from './capabilities/cardButtons';
import onDisable from './capabilities/onDisable';
import onEnable from './capabilities/onEnable';
import RemoveData from './capabilities/RemoveData';

window.TrelloPowerUp.initialize({
  'card-buttons': cardButtons,
  'on-enable': onEnable,
  'on-disable': onDisable,
  'remove-data': RemoveData,
});
