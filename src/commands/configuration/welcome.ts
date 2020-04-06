import { Message, TextChannel } from 'discord.js';
import ModuleCommand, { ModuleOptionArgs, DetailsFuncResult } from '@struct/command/ModuleCommand';
import { sendWelcomeMessage } from '@utils/ModuleUtils';
import { EMOJIS } from '@utils/Constants';

const validate = (message: Message, { guildData: { data } }: ModuleOptionArgs) => {
  return !!(data.welcome?.channelId && message.guild.channels.has(data.welcome?.channelId));
};

interface MessageArgs {
  message: string;
}

interface ChannelArgs {
  channel: TextChannel;
}

export default ModuleCommand(
  'welcome',
  {
    aliases: ['configurarbv'],
    channelRestriction: 'guild',
    userPermissions: 'MANAGE_CHANNELS',
  },
  [
    {
      id: 'enable',
      validate: (...args) => !validate(...args),
      async run(msg, t, { guildData, message, channel }: ModuleOptionArgs & ChannelArgs & MessageArgs) {
        await guildData.welcome.enable(channel.id, message);
        return msg.reply(t('commands:welcome.enabled', { channel }));
      },
    },
    {
      id: 'disable',
      validate,
      async run(msg, t, { guildData }) {
        await guildData.welcome.disable();
        return msg.reply(t('commands:welcome.disabled'));
      },
    },
    {
      id: 'set_message',
      validate,
      async run(msg, t, { message, guildData }: ModuleOptionArgs & MessageArgs) {
        await guildData.welcome.setMessage(message);
        return msg.reply(t('commands:welcome.message_changed'));
      },
    },
    {
      id: 'set_channel',
      validate,
      async run(msg, t, { channel, guildData }: ModuleOptionArgs & ChannelArgs) {
        await guildData.welcome.setChannel(channel.id);
        return msg.reply(t('commands:welcome.channel_changed'));
      },
    },
    {
      id: 'test',
      validate,
      async run(msg, t, { guildData }) {
        await sendWelcomeMessage(msg.member);
        if (guildData.welcome.channelId === msg.channel.id) {
          msg.reply(t('commands:welcome.current_channel_tested', { emoji: EMOJIS.WINK }));
        } else {
          msg.reply(
            t('commands:welcome.channel_tested', {
              emoji: EMOJIS.WINK,
              channel: msg.guild.channels.get(String(guildData.welcome.channelId)),
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
  (m, t, { guildData }) => {
    const fields: DetailsFuncResult = [];

    if (validate(m, { guildData })) {
      const channelId = String(guildData.welcome.channelId);
      fields.push([t('modules:welcome.current_message'), String(guildData.welcome.message)]);
      fields.push([
        t('modules:welcome.current_text_channel'),
        m.guild.channels.get(channelId)?.toString() || channelId,
      ]);
    }

    return fields;
  },
);
