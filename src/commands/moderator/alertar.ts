import Command, { TFunction, Prompt } from '@struct/Command';

import { Message } from 'discord.js';

interface ArgsI {
  text: string;
}

class AlertarCommand extends Command {
  constructor() {
    super('alertar', {
      aliases: ['alertar'],
      help: 'alertar',
      category: 'moderator',
      channelRestriction: 'guild',
      userPermissions: 'ADMINISTRATOR',
      args: [
        {
          id: 'text',
          type: 'string',
          match: 'text',
          prompt: {
            start: Prompt('commands:alertar.args.text.start'),
            retry: Prompt('commands:alertar.args.text.retry'),
          },
        },
      ],
    });
  }

  async run(msg: Message, t: TFunction, args: ArgsI) {
    const dms = await Promise.all(
      msg.guild.members.filter(m => !m.user.bot).map(member => member.createDM().catch(() => null)),
    );
    dms.forEach(dm => {
      if (dm) {
        dm.send(args.text).catch(() => null);
      }
    });

    msg.reply(t('commands:alertar.message'));
  }
}

export default AlertarCommand;
