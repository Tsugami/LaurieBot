import NeekoCommand from '@utils/NeekoCommand';
import Neeko from '@services/neko';

export default new NeekoCommand(
  'slap',
  ['bater'],
  'commands:slap.message',
  async () => {
    const res = await Neeko.sfw.slap();
    return res.url;
  },
  'bater',
);
