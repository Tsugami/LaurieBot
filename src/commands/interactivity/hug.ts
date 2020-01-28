import NeekoCommand from '@utils/NeekoCommand';
import Neeko from '@services/neko';

export default new NeekoCommand('hug', ['abraçar'], 'commands:hug.message', async () => {
  const res = await Neeko.sfw.hug();
  return res.url;
});
