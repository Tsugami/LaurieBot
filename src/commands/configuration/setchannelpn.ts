import { Message, TextChannel } from 'discord.js';
import ModuleCommand, { ModuleOptionArgs } from '@struct/ModuleCommand';

const validate = (message: Message, { guildData: { data } }: ModuleOptionArgs) => {
  return !!(data.penaltyChannel && message.guild.channels.has(data.penaltyChannel));
};

export default new ModuleCommand(
  'pnconfig',
  'configurarpn',
  {
    aliases: ['setchannelpn', 'setcanalpn', 'configurarpn'],
    userPermissions: 'MANAGE_GUILD',
    channelRestriction: 'guild',
  },
  [
    {
      id: 'enable',
      aliases: ['ativar'],
      validate: (m, a) => !validate(m, a),
      async run(msg, t, args: ModuleOptionArgs & { channel: TextChannel }) {
        await args.guildData.setPenaltyChannel(args.channel.id);
        msg.reply(t('commands:pnconfig.enabled', { channel: args.channel.toString() }));
      },
    },
    {
      id: 'disable',
      aliases: ['desativar'],
      validate,
      async run(msg, t, { guildData }) {
        await guildData.removePenaltyChannel();
        msg.reply(t('commands:pnconfig.disabled'));
      },
    },
    {
      id: 'change_channel',
      aliases: ['alterar-canal', 'change_channel'],
      validate,
      async run(msg, t, { guildData, channel }: ModuleOptionArgs & { channel: TextChannel }) {
        const oldChannel =
          msg.guild.channels.get(String(guildData.data.penaltyChannel))?.toString() ||
          guildData.data.penaltyChannel ||
          '---';
        await guildData.setPenaltyChannel(channel.id);
        msg.reply(t('commands:pnconfig.channel_changed', { oldChannel, channel }));
      },
    },
  ],
  {
    channel: ['textChannel', ['enable', 'change_channel']],
  },
);
