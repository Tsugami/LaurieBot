import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { TicketCategory } from '../../categories';
import { guild }  from '../../database';
import { Ticket }  from '../../database/models/Guild';
import GuildController from 'database/controllers/GuildController';

type goodResult = { ticket: Ticket, guildData: GuildController }
type ticketId = 'desabilidado' | 'no-tickets' | 'user-no-ticket' |'user-no-perm' | goodResult
interface ArgsI {
  ticketId: ticketId
}

class CloseTicketCommand extends Command {
  constructor() {
    super('close', {
      aliases: ['close'],
      category: TicketCategory,
      channelRestriction: 'guild',
      args: [
        {
          id: 'ticketId',
          type: async (w, msg, args): Promise<ticketId> => {
            const guildData = await guild(msg.guild.id)
            const ticketData = guildData.data.ticket

            if (!ticketData || !ticketData.active) return 'desabilidado'
            if (!ticketData.tickets) return 'no-tickets'

            const hasRole = () => ticketData.role &&  msg.member.roles.has(ticketData.role)
            const hasPermission = () => !msg.member.permissions.has('ADMINISTRATOR') || hasRole()

            if (!w) {
              // check if channel is ticket channel
              const ticketChannel = ticketData.tickets.find(x => x.channelId === msg.channel.id)
              if (ticketChannel) {
                return { ticket: ticketChannel, guildData}
              }
              // check if user has ticket
              const userTicket = ticketData.tickets.find(x => x.authorId === msg.author.id && !x.closed)
              if (userTicket) {
                return { ticket: userTicket, guildData }
              }
              // check if user has permission to manager ticket's
              if (hasPermission()) {
                return 'user-no-ticket'
              } else {
                return Promise.reject()
              }
            } else {
              if (hasPermission()) return 'user-no-perm'

              const handler = (x: 'textChannel' | 'member') => this.client.commandHandler.resolver.type(x)(w, msg, args)
              // check if that's user
              const channel = handler('textChannel')
              if (channel) {
                const find =  ticketData.tickets.find(x => x.channelId === channel.id)
                if (find) return {ticket: find, guildData }
                else return Promise.reject()
              }
              // check if that's user
              const member = handler('member')
              if (member) {
                const find =  ticketData.tickets.find(x => x.authorId === member.user.id && !x.closed)
                if (find) return { ticket: find, guildData }
                else return Promise.reject()
              }

              return Promise.reject()
            }
          },
          prompt: {
            start: `digite o nome do dono do ticket ou o canal do ticket para fechat.`,
            retry: 'input invalido.'
          },
        },
        ],
      defaultPrompt: {
        cancelWord: 'cancelar',
        cancel: 'Comando cancelado.',
      }
    });
  }

  async exec (msg: Message, args: ArgsI) {
    if (args.ticketId === 'desabilidado') {
      return msg.reply('os ticket\'s estão desabilitados.')
    } else if (args.ticketId === 'no-tickets') {
      return msg.reply('não tem nenhum ticket aberto.')
    } else if (args.ticketId === 'user-no-ticket') {
      return msg.reply('você não tem nenhum ticket aberto.')
    } else if (args.ticketId === 'user-no-perm') {
      return msg.reply('você não tem permissão para fechar ticket\'s.')
    }
    const { guildData, ticket } = args.ticketId

    const closeTicket = async () => {
      const channel = msg.guild.channels.get(ticket.channelId)
      if (channel) await channel.delete()
      return guildData.updateTickets({
        channelId: ticket.channelId,
        authorId: ticket.authorId,
        category: ticket.category,
        closed: true,
        closedAt: new Date(),
        closedBy: msg.author.id
      })
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
