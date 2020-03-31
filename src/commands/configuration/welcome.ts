import { Message, TextChannel } from 'discord.js';
import ModuleCommand, { ModuleOptionArgs } from '@struct/ModuleCommand';
import { sendWelcomeMessage } from '@utils/ModuleUtils';
import { Emojis } from '@utils/Constants';

const validate = (message: Message, { guildData: { data } }: ModuleOptionArgs) => {
  return !!(data.welcome?.channelId && message.guild.channels.has(data.welcome?.channelId));
};

interface MessageArgs {
  message: string;
}

interface ChannelArgs {
  channel: TextChannel;
}

export default new ModuleCommand(
  'welcome',
  'configurarbv',
  {
    aliases: ['welcome', 'configurarbv'],
    channelRestriction: 'guild',
    userPermissions: 'MANAGE_CHANNELS',
  },
  [
    {
      id: 'enable',
      aliases: ['ativar'],
      validate: (...args) => !validate(...args),
      async run(msg, t, { guildData, message, channel }: ModuleOptionArgs & ChannelArgs & MessageArgs) {
        await guildData.welcome.enable(channel.id, message);
        return msg.reply(t('commands:welcome.enabled', { channel }));
      },
    },
    {
      id: 'disable',
      aliases: ['desativar'],
      validate,
      async run(msg, t, { guildData }) {
        await guildData.welcome.disable();
        return msg.reply(t('commands:welcome.disabled'));
      },
    },
    {
      id: 'set_message',
      aliases: ['mensagem', 'alterar mensagem'],
      validate,
      async run(msg, t, { message, guildData }: ModuleOptionArgs & MessageArgs) {
        await guildData.welcome.setMessage(message);
        return msg.reply(t('commands:welcome.message_changed'));
      },
    },
    {
      id: 'set_channel',
      aliases: ['canal', 'alterar canal'],
      validate,
      async run(msg, t, { channel, guildData }: ModuleOptionArgs & ChannelArgs) {
        await guildData.welcome.setChannel(channel.id);
        return msg.reply(t('commands:welcome.channel_changed'));
      },
    },
    {
      id: 'test',
      aliases: ['testar'],
      validate,
      async run(msg, t, { guildData }) {
        await sendWelcomeMessage(msg.member);
        if (guildData.data.penaltyChannel === msg.channel.id) {
          msg.reply(t('commands:welcome.current_channel_tested', { emoji: Emojis.WINK }));
        } else {
          msg.reply(
            t('commands:welcome.channel_tested', {
              emoji: Emojis.WINK,
              channel: msg.guild.channels.get(String(guildData.data.penaltyChannel)),
            }),
          );
        }
      },
    },
  ],
  {
    message: ['string', ['enable', 'set_message']],
    channel: ['textChannel', ['enable', 'set_channel']],
  },
);
