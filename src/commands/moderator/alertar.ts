import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { Moderator } from '../../categories';

interface ArgsI {
  text: string
}

class AlertarCommand extends Command {
  constructor() {
    super('alertar', {
      aliases: ['alertar'],
      category: Moderator,
      channelRestriction: 'guild',
      userPermissions: 'ADMINISTRATOR',
      args: [
        {
          id: 'text',
          type: 'string',
          match: 'text',
          prompt: {
            start: 'uma mensagem você quer alertar?',
            retry: 'mensagem invalida.'
          }
        }
      ],
    });
  }

  async exec (msg: Message, args: ArgsI) {
    const dms = await Promise.all(msg.guild.members.filter(m => !m.user.bot).map(member => member.createDM().catch(() => null)))
    for (const dm of dms) {
      if (dm) {
        dm.send(args.text).catch(() => null)
      }
    }
    msg.reply('mensagem enviada para todas as pessoas poossiveis!')
  }
}

export default AlertarCommand;
