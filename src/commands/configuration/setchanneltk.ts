import { Command } from 'discord-akairo';
import { Message, TextChannel, CategoryChannel , Role } from 'discord.js';

import { Configuration } from '../../categories';
import { guild } from '../../database';

type Option<K extends string> = {
  key: K,
  message: string,
  aliases: string[]
}
const defineOptions = <K extends string>(options: Option<K>[]) => options;

const options = defineOptions([
  {
    key: 'enable',
    aliases: ['ativar', 'on'],
    message: 'Ativar Ticket\'s'
  },
  {
    key: 'disable',
    aliases: ['desativar', 'off'],
    message: 'Desativar Ticket\'s'
  },
  {
    key: 'channel',
    aliases: ['canal', 'alterar channel'],
    message: 'Alterar canal principal.'
  },
  {
    key: 'category',
    aliases: ['categoria'],
    message: 'Setar/Alterar categoria dos canais.'
  },
  {
    key: 'role',
    aliases: ['cargo'],
    message: 'Setar/Alterar o cargo de suporte.'
  },
  {
    key: 'cancel',
    aliases: ['cancelar'],
    message: 'Cancelar'
  }
]);

type Keys = (typeof options)[number]["key"];

interface ArgsI {
  option: Keys,
  channel: TextChannel,
  category: CategoryChannel,
  role: Role
}

class SetChannelTkCommand extends Command {
  constructor() {
    super('setcanaltk', {
      aliases: ['setcanaltk'],
      userPermissions: 'ADMINISTRATOR',
      clientPermissions: 'ADMINISTRATOR',
      category: Configuration,
      channelRestriction: 'guild',
      args: [
        {
          id: 'option',
          type: (w) => {
            const x = options.find((x, i) => Number(w) === (i + 1) || w === x.key || x.aliases.includes(w))
            if (x) return x.key
          },
          prompt: {
            start: '\n' + options.map((o, i) => `**${i + 1}**: ${o.message}`).join('\n'),
            retry: 'digite uma das opções corretamente.'
          }
        }, {
          id: 'channel',
          type: (w, msg, args: ArgsI) => {
            return args.option === 'channel' ? this.client.commandHandler.resolver.type('textChannel')(w, msg, args) : ''
          },
          prompt: {
            start: 'digite pra qual canal de texto você quer alterar.',
            retry: 'digite canal de texto corretamente.'
          }
        }, {
          id: 'category',
          type: (w, msg, args: ArgsI) => {
            if (args.option === 'category') {
              const categoryChannel = this.client.commandHandler.resolver.type('channel')(w, msg, args)
              if (categoryChannel instanceof CategoryChannel) {
                return categoryChannel
              } else return null
            } else return ''
          },
          prompt: {
            start: 'digite pra qual categoria você quer alterar/setar.',
            retry: 'digite a categoria corretamente.'
          }
        }, {
          id: 'role',
          type: (w, msg, args: ArgsI) => {
            return args.option === 'role' ? this.client.commandHandler.resolver.type('role')(w, msg, args) : ''
          },
          prompt: {
            start: 'digite pra qual cargo você quer alterar/setar.',
            retry: 'digite cargo corretamente.'
          }
        }
        ],
      defaultPrompt: {
        cancelWord: 'cancelar',
        cancel: 'Comando cancelado.',
      }
    });
  }

  async exec (msg: Message, args: ArgsI) {
    if (args.option === 'cancel') {
      return msg.reply('comando cancelado.')
    }

    const guildData = await guild(msg.guild.id)
    const ticket = guildData.data.ticket

    switch (args.option) {
      case 'enable': {
        if (ticket && ticket.active) {
          return msg.reply('os ticket\'s já estão ativos.')
        }
        await guildData.updateTicket({ active: true, channelId: msg.channel.id })
        this.client.emit('ticketActivated', guildData, msg.guild, msg.channel)
        return msg.reply('os  ticket\' foram ativados nesse canal.')
      }
      case 'disable': {
        if (!ticket || !ticket.active) {
          return msg.reply('os ticket\'s já estão desativado.')
        }
        this.client.emit('disabledTicket', guildData, msg.guild)
        await guildData.updateTicket({ active: true, channelId: msg.channel.id })
        return msg.reply('os  ticket\'s foram desativados nesse canal.')
      }
      case 'channel': {
        if (!ticket || !ticket.active) {
          return msg.reply('não é possivel alterar o canal com os ticket\'s estão desativados.')
        }
        const oldId = ticket.channelId
        if (oldId === args.channel.id) {
          return msg.reply(`o canal ${args.channel.toString()} já está definido como canal principal.`)
        }


        const oldChannel = msg.guild.channels.get(ticket.channelId)
        await guildData.updateTicket({ channelId: args.channel.id })
        this.client.emit('ticketChannelChanged', guildData, msg.guild, oldChannel, args.channel)
        return msg.reply(`canal de ticket's alterado. ${oldChannel ? oldChannel.toString() : oldId} **>>>** ${args.channel}`)
      }
      case 'category': {
        if (!ticket || !ticket.active) {
          return msg.reply('não é possivel alterar o canal com os ticket\'s estão desativados.')
        }
        const oldId = ticket.categoryId
        if (oldId && oldId === args.category.id) {
          return msg.reply(`a categoria **${args.category.name}** já está definido como categoria de ticket's.`)
        }

        await guildData.updateTicket({ categoryId: args.category.id, channelId: ticket.channelId })
        this.client.emit('ticketCategoryChannelChanged', guildData, msg.guild, args.category)
        let text: string
        if (oldId) {
          const oldCategory = msg.guild.channels.get(oldId)
          text = `categoria de ticket's alterada. ${oldCategory ? oldCategory.name.toUpperCase() : oldId} **>>>** ${args.category.name.toUpperCase()}`
        } else {
          text = `categoria de ticket's setada para **${args.category.name.toUpperCase()}**.`
        }

        return msg.reply(text)
      }
      case 'role': {
        if (!ticket || !ticket.active) {
          return msg.reply('não é possivel alterar o cargo com os ticket\'s estão desativados.')
        }
        const oldId = ticket.role
        if (oldId && oldId === args.role.id) {
          return msg.reply(`a cargo **${args.role.name}** já está definido como cargo de suporte dos ticket's.`)
        }

        await guildData.updateTicket({ role: args.role.id, channelId: ticket.channelId })
        this.client.emit('ticketRoleChanged', guildData, msg.guild, oldId, args.role)
        let text: string
        if (oldId) {
          const oldRole = msg.guild.roles.get(oldId)
          text = `cargo de ticket's alterada. ${oldRole ? oldRole.name.toUpperCase() : oldId} **>>>** ${args.role.name.toUpperCase()}`
        } else {
          text = `cargo de ticket's setada para **${args.role.name.toUpperCase()}**.`
        }

        return msg.reply(text)
      }
    }
  }
}

export default SetChannelTkCommand;
