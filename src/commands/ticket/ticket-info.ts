import Command, { TFunction } from '@struct/Command';

import { Message, User } from 'discord.js';
import { Ticket } from '@database/models/Guild';
import GuildController from 'database/controllers/GuildController';
import { findTicketTypeArg, getEmojiByCategory } from '@ticket/TicketUtil';
import Embed from '@utils/Embed';
import Text from '@utils/Text';
import { getDate } from '@utils/Date';
import { Emojis } from '@utils/Constants';

type goodResult = { ticket: Ticket; guildData: GuildController };
type ticket = 'desabilidado' | 'no-tickets' | 'user-no-ticket' | 'user-no-perm' | goodResult;
interface ArgsI {
  ticket: ticket;
}

class TicketInfoCommand extends Command {
  constructor() {
    super('ticket-info', {
      aliases: ['ticket-info'],
      category: 'discord',
      channelRestriction: 'guild',
      args: [
        {
          id: 'ticket',
          type: (w, msg, args) => findTicketTypeArg(w, msg, args, this.client.commandHandler.resolver.type, false),
          prompt: {
            start: `digite o id/dono/canal do ticket.`,
            retry: 'input invalido.',
          },
        },
      ],
      defaultPrompt: {
        cancelWord: 'cancelar',
        cancel: 'Comando cancelado.',
      },
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    if (args.ticket === 'desabilidado') {
      return msg.reply("esse comando só está disponivel com os ticket's ativo.");
    }
    if (args.ticket === 'no-tickets') {
      return msg.reply('não tem nenhum ticket existente.');
    }
    if (args.ticket === 'user-no-ticket') {
      return msg.reply('tente executar o comando denovo com id do seu ticket.');
    }
    if (args.ticket === 'user-no-perm') {
      return msg.reply("você não tem permissão para visualizar ticket's.");
    }

    if (!args.ticket) return msg.reply('ticket invalido.');

    console.log(args.ticket);

    const { ticket } = args.ticket;
    const { client } = msg;

    const getUser = async (id: string) => client.users.get(id) || client.fetchUser(id).catch(() => null);
    const getName = (user: User | null) => (user ? user.username : 'Desconhecido');

    const openUser = await getUser(msg.author.id);

    const categoryEmoji = ticket.category ? getEmojiByCategory(ticket.category) : Emojis.UNKNOWN;
    const categoryPt = ticket.category == 'question' ? 'Duvida' : ticket.category === 'report' ? 'Report' : 'Revisão';
    const created = ticket.createdAt ? getDate(ticket.createdAt) : '';

    const status = ticket.closed ? 'Fechado' : 'Aberto';
    const statusEmoji = ticket.closed ? Emojis.LOCK : Emojis.UNLOCK;

    const rank = typeof ticket.rating === 'number' ? ticket.rating : 'Não declarada';
    const rankEmoji =
      typeof ticket.rating === 'number'
        ? ticket.rating > 5
          ? Emojis.STRONKS
          : Emojis.NOT_STRONKS
        : Emojis.NOT_STRONKS;

    const usersCount = ticket.users ? ticket.users.length : 0;

    const text = new Text()
      .addTitle(Emojis.FOLDER, 'INFORMAÇÕES DO TICKET')
      .addField(categoryEmoji, 'Categoria', categoryPt)
      .addField(Emojis.PERSON, 'Criado por', getName(openUser))
      .addField(Emojis.CALENDER, 'Criado em', created)
      .addField(statusEmoji, 'Status', status)
      .addField(rankEmoji, 'Nota', rank)
      .addField(Emojis.PERSONS, 'Participantes', usersCount);

    if (!ticket.closed) {
      const channel = msg.guild.channels.get(ticket.channelId);
      if (channel) text.addField(Emojis.SPEECH_BALLON, 'Canal', channel.toString());
    } else {
      const user = ticket.closedBy === ticket.authorId ? openUser : ticket.closedBy && (await getUser(ticket.closedBy));
      const date = ticket.closedAt && getDate(ticket.closedAt);

      if (user) text.addField(Emojis.PERSON, 'Fechado por', getName(user));
      if (date) text.addField(Emojis.CALENDER, 'Fechado em', date);
    }

    const embed = new Embed(msg.author).setDescription(text);

    if (openUser) embed.setThumbnail(openUser.displayAvatarURL);

    return msg.reply(embed);
  }
}

export default TicketInfoCommand;
