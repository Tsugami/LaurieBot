import Command, { TFunction } from '@struct/Command';
import { Message } from 'discord.js';
import { guild } from '@database/index';
import Embed from '@utils/Embed';
import categories from '@struct/categories';

export default class AtivarTicket extends Command {
  constructor() {
    super('ativar-tk', {
      aliases: ['ativar-ticket', 'ativar-tk'],
      help: 'ativar-tk',
      category: 'ticket',
      clientPermissions: 'ADMINISTRATOR',
      userPermissions: 'ADMINISTRATOR',
    });
  }

  async run(msg: Message, t: TFunction) {
    const guildData = await guild(msg.guild.id);
    await guildData.ticket.enable();

    msg.reply(
      new Embed(msg.author)
        .setDescription(t('commands:ativar_tk.message', { prefix: this.getPrefix(msg) }))
        .setTitle(t('commands:ativar_tk.title'))
        .addFields(
          categories.ticket
            .filter(c => c.id !== this.id)
            .map(c => [c.id, t(`commands:${c.id.replace('-', '_')}.description`)]),
        ),
    );
  }
}
