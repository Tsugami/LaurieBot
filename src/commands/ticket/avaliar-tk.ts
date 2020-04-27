/* eslint-disable no-underscore-dangle */
import Command from '@structures/LaurieCommand';
import { Message } from 'discord.js';
import LaurieEmbed from '@structures/LaurieEmbed';
import { RATE_EMOJIS } from '@utils/constants';

function getRateByEmoji(emoji: string): keyof typeof RATE_EMOJIS {
  if (RATE_EMOJIS.bad === emoji) return 'bad';
  if (RATE_EMOJIS.good === emoji) return 'good';
  return 'normal';
}

export default class AvaliarTk extends Command {
  constructor() {
    super('avaliar-tk', {
      editable: false,
      aliases: ['avaliar-ticket', 'rate-tk', 'ratetk'],
      category: 'ticket',
      channel: 'guild',
      clientPermissions: ['ADD_REACTIONS', 'EMBED_LINKS'],
      args: [
        {
          id: 'id',
          type: 'string',
        },
      ],
    });
  }

  async exec(msg: Message, { id }: { id: string }) {
    const guildData = await this.client.database.getGuild(msg.guild?.id as string);

    if (!guildData.data.ticket) return;
    if (!guildData.isId(id)) return msg.reply(msg.t('commands:avaliar_tk.is_not_id'));

    // eslint-disable-next-line no-underscore-dangle
    const ticket = guildData.data.ticket.tickets.find(tk => tk._id && tk._id.equals(id));
    if (!ticket) return msg.reply(msg.t('commands:avaliar_tk.not_exists'));
    if (ticket.rate) return msg.reply(msg.t('commands:avaliar_tk.already_was_rating'));
    if (ticket.authorId !== msg.author.id) return msg.reply(msg.t('commands:avaliar_tk.not_owner'));

    const sent = await msg.reply(
      new LaurieEmbed(msg.author).setAuthor(msg.t('commands:avaliar_tk.title')).setDescription(
        `${msg.t('commands:avaliar_tk.embed')}\n\n${Object.entries(RATE_EMOJIS)
          .map(c => `${c[1]}  ${msg.t(`commands:avaliar_tk.${c[0]}`)}`)
          .join('\n')}`,
      ),
    );
    if (sent instanceof Message) {
      const addEmoji = async () => {
        await sent.react(RATE_EMOJIS.good);
        await sent.react(RATE_EMOJIS.normal);
        await sent.react(RATE_EMOJIS.bad);
      };

      addEmoji();

      const colector = sent.createReactionCollector((r, u) => r.me && u.id === msg.author.id);

      colector.on('collect', async c => {
        const rate = getRateByEmoji(c.emoji.toString());

        if (ticket._id) {
          await guildData.ticket.ratingTicket(ticket._id, rate);
          sent.delete();
          msg.reply(msg.t('commands:avaliar_tk.message'));
        }
      });
    }
  }
}
