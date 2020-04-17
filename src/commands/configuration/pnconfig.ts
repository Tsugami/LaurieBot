// import { Message, TextChannel } from 'discord.js';
// import ModuleCommand, { ModuleOptionArgs } from '@struct/command/ModuleCommand';
// import { EMOJIS } from '@utils/Constants';
// import { sendPunaltyMessage } from '../../utils/ModuleUtils';
// import MuteCommand from '../moderator/mute';

// const validate = (message: Message, { guildData: { data } }: ModuleOptionArgs) => {
//   return !!(data.penaltyChannel && message.guild.channels.has(data.penaltyChannel));
// };

// export default ModuleCommand(
//   'pnconfig',
//   {
//     aliases: ['configurarpn', 'setchannelpn', 'setcanalpn'],
//     userPermissions: 'MANAGE_GUILD',
//     channelRestriction: 'guild',
//   },
//   [
//     {
//       id: 'enable',
//       validate: (m, a) => !validate(m, a),
//       async run(msg, t, args: ModuleOptionArgs & { channel: TextChannel }) {
//         await args.guildData.setPenaltyChannel(args.channel.id);
//         msg.reply(t('commands:pnconfig.enabled', { channel: args.channel.toString() }));
//       },
//     },
//     {
//       id: 'disable',
//       validate,
//       async run(msg, t, { guildData }) {
//         await guildData.removePenaltyChannel();
//         msg.reply(t('commands:pnconfig.disabled'));
//       },
//     },
//     {
//       id: 'change_channel',
//       validate,
//       async run(msg, t, { guildData, channel }: ModuleOptionArgs & { channel: TextChannel }) {
//         const oldChannel =
//           msg.guild.channels.get(String(guildData.data.penaltyChannel))?.toString() ||
//           guildData.data.penaltyChannel ||
//           '---';
//         await guildData.setPenaltyChannel(channel.id);
//         msg.reply(t('commands:pnconfig.channel_changed', { oldChannel, channel }));
//       },
//     },
//     {
//       id: 'test',
//       validate,
//       async run(msg, t, { guildData }) {
//         await sendPunaltyMessage(msg, msg.guild.me, MuteCommand.id, t('commands:pnconfig.it_is_test'));
//         if (guildData.data.penaltyChannel === msg.channel.id) {
//           msg.reply(t('commands:pnconfig.current_channel_tested', { emoji: EMOJIS.WINK }));
//         } else {
//           msg.reply(
//             t('commands:pnconfig.channel_tested', {
//               emoji: EMOJIS.WINK,
//               channel: msg.guild.channels.get(String(guildData.data.penaltyChannel)),
//             }),
//           );
//         }
//       },
//     },
//   ],
//   {
//     channel: ['textChannel', ['enable', 'change_channel']],
//   },
//   (m, t, args) => {
//     return validate(m, args)
//       ? [
//           [
//             t('modules:pnconfig.current_channel'),
//             String(m.guild.channels.get(String(args.guildData.data.penaltyChannel))?.toString()),
//           ],
//         ]
//       : [];
//   },
// );
