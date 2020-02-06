import Command, { TFunction } from '@struct/Command';
import { Message } from 'discord.js';
import { guild } from '@database/index';

export default class AtivarTicket extends Command {
  constructor() {
    super('desativar-tk', {
      aliases: ['desativar-ticket', 'desativar-tk'],
      help: 'desativar-tk',
      category: 'ticket',
      userPermissions: 'ADMINISTRATOR',
    });
  }

  async run(msg: Message, t: TFunction) {
    const guildData = await guild(msg.guild.id);
    await guildData.ticket.disable();

    msg.reply(t('commands:desativar_tk.message'));
  }
}
