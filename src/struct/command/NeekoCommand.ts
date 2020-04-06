import Command from '@struct/command/Command';
import Neeko from '@services/neko';
import LaurieEmbed from '../LaurieEmbed';

type NeekoTypes =
  | 'tickle'
  | 'slap'
  | 'smug'
  | 'baka'
  | 'poke'
  | 'pat'
  | 'neko'
  | 'nekoGif'
  | 'meow'
  | 'lizard'
  | 'kiss'
  | 'hug'
  | 'foxGirl'
  | 'feed'
  | 'cuddle'
  | 'woof';

export default function createNeekoCommand(id: string, fetch: NeekoTypes, aliases: string[] = []) {
  return new Command(
    id,
    {
      aliases,
      category: 'interactivity',
      args: [
        {
          id: 'user',
          type: 'user',
        },
      ],
    },
    async (msg, t, { user }) => {
      const { url } = await Neeko.sfw[fetch]();

      const embed = new LaurieEmbed(msg.author)
        .setDescription(t(`commands:${id}.message`, { author: msg.author, user }))
        .setImage(url);
      msg.reply(embed);
    },
  );
}
