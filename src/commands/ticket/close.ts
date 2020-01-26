import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { TicketCategory } from '../../categories';
import { findTicketTypeArg, TicketArgType } from '../../modules/ticket/TicketUtil'
import { Ticket } from 'database/models/Guild';

interface ArgsI {
  ticket: TicketArgType,
  rating: number | string
}

class CloseTicketCommand extends Command {
  constructor() {
    super('close', {
      aliases: ['close', 'fecharticket', 'fechar'],
      category: TicketCategory,
      channelRestriction: 'guild',
      args: [
        {
          id: 'ticket',
          type: (w, msg, args) => findTicketTypeArg(w, msg, args, this.client.commandHandler.resolver.type, true),
          prompt: {
            start: `digite o nome do dono do ticket ou o canal do ticket para fechat.`,
            retry: 'input invalido.'
          },
        },
        {
          id: 'rating',
          type: (w, msg, args: ArgsI) => {
            if (typeof args.ticket === 'object') {
              if (args.ticket.ticket.authorId === msg.author.id) {
                const num = parseInt(w)
                if (!isNaN(num)) {
                  return num > 10 ? 10 : num < 0 ? 0 : num
                } else return null
              } else return ''
            } else return ''
          },
          prompt: {
            start: `qual nota de 1 a 10 você da pra esse ticket?`,
            retry: 'digite um número valido.'
          },
        }
        ],
      defaultPrompt: {
        cancelWord: 'cancelar',
        cancel: 'Comando cancelado.',
      }
    });
  }

  async exec (msg: Message, args: ArgsI) {
    if (args.ticket === 'desabilidado') {
      return msg.reply('esse comando só está disponivel com os ticket\'s ativo.')
    } else if (args.ticket === 'no-tickets') {
      return msg.reply('não tem nenhum ticket existente.')
    } else if (args.ticket === 'user-no-ticket') {
      return msg.reply('você não tem nenhum ticket aberto.')
    } else if (args.ticket === 'user-no-perm') {
      return msg.reply('você não tem permissão para fechar ticket\'s.')
    } else if (args.ticket === 'all-closed') {
      return msg.reply('todos os ticket\'s estão fechados')
    }

    const { guildData, ticket } = args.ticket
    if (ticket.closed) {
      return msg.reply('esse ticket já está fechado.')
    }

    const closeTicket = async () => {
      const channel = msg.guild.channels.get(ticket.channelId)
      if (channel) await channel.delete()
      const data: Ticket = {
        channelId: ticket.channelId,
        authorId: ticket.authorId,
        category: ticket.category,
        closed: true,
        closedAt: new Date(),
        closedBy: msg.author.id
      }

      if (data && typeof args.rating === 'number') data.rating = args.rating

      return guildData.updateTickets(data)
    }

    const sendMessage = (s: string) => {
      if (msg.channel.id !== ticket.channelId) {
        msg.reply(s+ ` para acessar as informações dele use \`${this.client.commandHandler.prefix(msg)}ticket-info ${ticket._id}\``)
      }
    }

    await closeTicket()

    if (ticket.authorId === msg.author.id) {
      return sendMessage(`seu ticket foi fechado.`)
    } else {
      return sendMessage('ticket fechado.')
    }
  }
}

export default CloseTicketCommand;
