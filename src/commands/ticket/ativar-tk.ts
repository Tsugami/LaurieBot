import Command, { TFunction } from '@struct/Command';
import { Message } from 'discord.js';
import { guild } from '@database/index';
import Embed from '@utils/Embed';

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
        .addField('desativar-tk', t('commands:desativar_tk.description'))
        .addField('abrir-tk', t('commands:abrir_tk.description'))
        .addField('fechar-tk', t('commands:fechar_tk.description'))
        .addField('info-tk', t('commands:info_tk.description'))
        .addField('setcategoria-tk', t('commands:setcategoria_tk.description'))
        .addField('setcargo-tk', t('commands:setcategoria_tk.description')),
    );
  }
}
