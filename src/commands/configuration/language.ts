import Command from '@structures/LaurieCommand';
import { Message } from 'discord.js';
import locales from '@utils/locales';
import LaurieEmbed from '../../structures/LaurieEmbed';

export default class SetLanguage extends Command {
  constructor() {
    super('setlanguage', {
      editable: false,
      aliases: ['setlang', 'setlingua'],
      category: 'configuration',
      channel: 'guild',
      args: [
        {
          id: 'language',
          type: locales.languages,
          otherwise: async (m: Message) => {
            return m.t(`${this.tPath}.args.language.otherwise`, {
              languages: this.locales.languages.map(l => `\`${l}\``).join(', '),
            });
          },
        },
      ],
    });
  }

  async exec(msg: Message, { language }: { language: string }) {
    const guildData = await this.client.database.getGuild(msg.guild?.id as string);
    guildData.setLanguage(language);
    return msg.reply(
      new LaurieEmbed(null, (await this.locales.getFixedT(language))(`${this.tPath}.changed`, { language })),
    );
  }
}
