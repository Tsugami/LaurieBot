import { Message, TextChannel, GuildMember } from 'discord.js';
import ModuleCommand from '@structures/ModuleCommand';
import WelcomeUtil from '@utils/modules/welcome';
import GuildController from '@database/controllers/GuildController';
import { EMOJIS } from '@utils/constants';

const validate = (message: Message, guildData: GuildController) => {
  return !!(guildData.welcome.channelId && message.guild?.channels.cache.has(guildData.welcome?.channelId));
};

interface MessageArgs {
  message: string;
}

interface ChannelArgs {
  channel: TextChannel;
}

export default class Welcome extends ModuleCommand {
  constructor() {
    super(
      'welcome',
      [
        {
          id: 'enable',
          validate: (...args) => !validate(...args),
          async run(msg, guildData, { message, channel }: ChannelArgs & MessageArgs) {
            await guildData.welcome.enable(channel.id, message);
            return msg.reply(msg.t(`${this.tPath}.enabled`, { channel }));
          },
        },
        {
          id: 'disable',
          validate,
          async run(msg, guildData) {
            await guildData.welcome.disable();
            return msg.reply(msg.t(`${this.tPath}.disabled`));
          },
        },
        {
          id: 'set_message',
          validate,
          async run(msg, guildData, { message }: MessageArgs) {
            await guildData.welcome.setMessage(message);
            return msg.reply(msg.t(`${this.tPath}.message_changed`));
          },
        },
        {
          id: 'set_channel',
          validate,
          async run(msg, guildData, { channel }: ChannelArgs) {
            await guildData.welcome.setChannel(channel.id);
            return msg.reply(msg.t(`${this.tPath}.channel_changed`));
          },
        },
        {
          id: 'test',
          validate,
          async run(msg, t, { guildData }) {
            await WelcomeUtil.send(msg.member as GuildMember);
            if (guildData.welcome.channelId === msg.channel.id) {
              msg.reply(msg.t(`${this.tPath}.current_channel_tested`, { emoji: EMOJIS.WINK }));
            } else {
              msg.reply(
                msg.t(`${this.tPath}.channel_tested`, {
                  emoji: EMOJIS.WINK,
                  channel: msg.guild?.channels.cache.get(String(guildData.welcome.channelId)),
                }),
              );
            }
          },
        },
      ],
      [
        [['enable', 'set_message'], { id: 'message', type: 'string' }],
        [['enable', 'set_channel'], { id: 'channel', type: 'textChannel' }],
      ],
      {
        aliases: ['bemvindo'],
        userPermissions: 'MANAGE_GUILD',
        lock: 'guild',
      },
      (embed, msg, guildData) => {
        if (validate(msg, guildData)) {
          const channelId = String(guildData.welcome.channelId);
          embed.addField(msg.t('modules:welcome.current_message'), String(guildData.welcome.message));
          embed.addField(
            msg.t('modules:welcome.current_text_channel'),
            msg.guild?.channels.cache.get(channelId)?.toString() || channelId,
          );
        }
      },
    );
  }
}
