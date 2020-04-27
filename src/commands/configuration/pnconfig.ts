import { Message, TextChannel, GuildMember } from 'discord.js';
import GuildController from '@database/controllers/GuildController';
import { EMOJIS } from '@utils/constants';
import ModuleCommand from '@structures/ModuleCommand';
import PunishmentUtil from '@utils/modules/punishment';

const validate = (message: Message, guildData: GuildController) => {
  return !!(guildData.penaltyChannel && message.guild?.channels.cache.has(guildData.penaltyChannel));
};

export default class PnConfig extends ModuleCommand {
  constructor() {
    super(
      'pnconfig',
      [
        {
          id: 'enable',
          validate: (m, a) => !validate(m, a),
          async run(msg, guildData, { channel }: { channel: TextChannel }) {
            await guildData.setPenaltyChannel(channel.id);
            msg.reply(msg.t('commands:pnconfig.enabled', { channel: channel.toString() }));
          },
        },
        {
          id: 'disable',
          validate,
          async run(msg, t, { guildData }) {
            await guildData.removePenaltyChannel();
            msg.reply(msg.t('commands:pnconfig.disabled'));
          },
        },
        {
          id: 'change_channel',
          validate,
          async run(msg, guildData, { channel }: { channel: TextChannel }) {
            const oldChannel =
              msg.guild?.channels.cache.get(String(guildData.data.penaltyChannel))?.toString() ||
              guildData.data.penaltyChannel ||
              '---';
            await guildData.setPenaltyChannel(channel.id);
            msg.reply(msg.t('commands:pnconfig.channel_changed', { oldChannel, channel }));
          },
        },
        {
          id: 'test',
          validate,
          async run(msg, t, { guildData }) {
            await PunishmentUtil.sendMessage(
              msg,
              msg.guild?.me as GuildMember,
              'mute',
              msg.t('commands:pnconfig.it_is_test'),
            );
            if (guildData.data.penaltyChannel === msg.channel.id) {
              msg.reply(msg.t('commands:pnconfig.current_channel_tested', { emoji: EMOJIS.WINK }));
            } else {
              msg.reply(
                msg.t('commands:pnconfig.channel_tested', {
                  emoji: EMOJIS.WINK,
                  channel: msg.guild?.channels.cache.get(String(guildData.data.penaltyChannel)),
                }),
              );
            }
          },
        },
      ],
      [[['enable', 'change_channel'], { id: 'channel', type: 'textChannel', match: 'rest' }]],
      {
        aliases: ['configurarpn'],
        userPermissions: 'MANAGE_GUILD',
        channel: 'guild',
      },
      (embed, msg, guildData) => {
        if (validate(msg, guildData)) {
          embed.addField(
            msg.t('modules:pnconfig.current_channel'),
            String(msg.guild?.channels.cache.get(String(guildData.data.penaltyChannel))?.toString()),
          );
        }
      },
    );
  }
}
