import NeekoCommand from '@utils/NeekoCommand';
import Neeko from '@services/neko';

export default new NeekoCommand('kiss', ['beijar'], 'commands:kiss.message', async () => {
  const res = await Neeko.sfw.kiss();
  return res.url;
});
