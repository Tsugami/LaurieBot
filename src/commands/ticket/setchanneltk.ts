import { Command } from 'discord-akairo';
import {
  Message, TextChannel, CategoryChannel, Role,
} from 'discord.js';
import {
  activateHandler, deactivateHandler, changeMainChannelHandler, changeCategoryHandler, changeRoleChange,
} from '@ticket/handlers';
import { TicketCategory } from '@categories';

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
    message: 'Ativar Ticket\'s',
  },
  {
    key: 'disable',
    aliases: ['desativar', 'off'],
    message: 'Desativar Ticket\'s',
  },
  {
    key: 'channel',
    aliases: ['canal', 'alterar channel'],
    message: 'Alterar canal principal.',
  },
  {
    key: 'category',
    aliases: ['categoria'],
    message: 'Setar/Alterar categoria dos canais.',
  },
  {
    key: 'role',
    aliases: ['cargo'],
    message: 'Setar/Alterar o cargo de suporte.',
  },
  {
    key: 'cancel',
    aliases: ['cancelar'],
    message: 'Cancelar',
  },
]);

type Keys = (typeof options)[number]['key'];

interface ArgsI {
  option: Keys,
  channel: TextChannel,
  category: CategoryChannel,
  role: Role,
}

class SetChannelTkCommand extends Command {
  constructor() {
    super('setcanaltk', {
      aliases: ['setcanaltk'],
      userPermissions: 'ADMINISTRATOR',
      clientPermissions: 'ADMINISTRATOR',
      category: TicketCategory,
      channelRestriction: 'guild',
      args: [
        {
          id: 'option',
          type: (w) => {
            const x = options.find((x, i) => Number(w) === (i + 1) || w === x.key || x.aliases.includes(w));
            if (x) return x.key;
          },
          prompt: {
            start: `\n${options.map((o, i) => `**${i + 1}**: ${o.message}`).join('\n')}`,
            retry: 'digite uma das opções corretamente.',
          },
        }, {
          id: 'channel',
          type: (w, msg, args: ArgsI) => {
            const textChannel = this.client.commandHandler.resolver.type('textChannel');
            return (args.option === 'channel' || args.option === 'enable') ? textChannel(w, msg, args) : '';
          },
          prompt: {
            start: 'digite pra qual canal de texto você quer que seja o principal.',
            retry: 'digite canal de texto corretamente.',
          },
        }, {
          id: 'category',
          type: (w, msg, args: ArgsI) => {
            if (args.option === 'category' || args.option === 'enable') {
              const categoryChannel = this.client.commandHandler.resolver.type('channel')(w, msg, args);
              if (categoryChannel instanceof CategoryChannel) {
                return categoryChannel;
              } return null;
            } return '';
          },
          prompt: {
            start: 'digite pra qual categoria você quer que seja criado os ticket\'s.',
            retry: 'digite a categoria corretamente.',
          },
        }, {
          id: 'role',
          type: (w, msg, args: ArgsI) => {
            const roleHandler = () => this.client.commandHandler.resolver.type('role')(w, msg, args);
            if (args.option === 'enable') {
              if (w === 'off') {
                return '';
              } return roleHandler();
            }
            return args.option === 'role' ? roleHandler() : '';
          },
          prompt: {
            start: (_: any, args: ArgsI) => {
              if (args.option === 'enable') return 'digite qual cargo que terá acesso aos ticket\'s. digite **OFF** pra pular essa etapa.';
              return 'digite pra qual cargo você quer alterar/setar.';
            },
            retry: 'digite cargo corretamente.',
          },
        },
      ],
      defaultPrompt: {
        cancelWord: 'cancelar',
        cancel: 'Comando cancelado.',
      },
    });
  }

  async exec(msg: Message, args: ArgsI) {
    if (args.option === 'cancel') {
      return msg.reply('comando cancelado.');
    }
    switch (args.option) {
      case 'enable':
        return activateHandler(msg, args.channel, args.category, args.role);
      case 'disable':
        return deactivateHandler(msg);
      case 'channel':
        return changeMainChannelHandler(msg, args.channel);
      case 'category':
        return changeCategoryHandler(msg, args.category);
      case 'role':
        return changeRoleChange(msg, args.role);
    }
  }
}

export default SetChannelTkCommand;
