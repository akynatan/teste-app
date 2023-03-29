import { BASE_URL } from '../../config';
import { trackPowerUpCardModalOpened } from '../../services/EventTracking';

const cardButtons = () => {
  return [
    {
      text: 'mLabs',
      icon: `${BASE_URL}/mlabs-icon-gray.svg`,
      callback: async (t) => {
        await trackPowerUpCardModalOpened();

        await t.popup({
          title: navigator.language === 'pt-BR' ? 'Agendamento' : 'Schedule',
          url: 'index.html',
          height: 200,
        });
      },
    },
  ];
};

export default cardButtons;
