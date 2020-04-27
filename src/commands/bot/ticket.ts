import LaurieCommand from '@structures/LaurieCommand';
import LaurieEmbed from '@structures/LaurieEmbed';
import { Message } from 'discord.js';

export default class Ticket extends LaurieCommand {
  constructor() {
    super('ticket', {
      category: 'bot',
      editable: false,
    });
  }

  async exec(msg: Message) {
    const { prefix } = this.handler;
    const ticketCategory = this.handler.categories.get('ticket');

    if (!ticketCategory) {
      throw new Error('N achei a categoria ticket');
    }

    const embed = new LaurieEmbed(msg.author)
      .setAuthor(msg.t(`${this.tPath}.title`))
      .addField(msg.t(`${this.tPath}.what`), msg.t(`${this.tPath}.what_message`))
      .addField(msg.t(`${this.tPath}.how`), msg.t(`${this.tPath}.how_message`))
      .addField(
        msg.t('commons:commands'),
        ticketCategory.map(c => `\`${prefix + c.help}\` ${msg.t(c.description)}`).join('\n'),
      );

    if (msg.guild) {
      const guildData = await this.client.database.getGuild(msg.guild.id);

      if (!guildData.ticket.active) {
        embed.addField(
          msg.t(`${this.tPath}.warn`),
          msg.t(`${this.tPath}.warn_message`, { command: `${prefix}tkconfig` }),
        );
      }
    }
    return msg.reply(embed);
  }
}
