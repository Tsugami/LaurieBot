"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _discordjs = require('discord.js');

var _Constants = require('@utils/Constants');
var _Embed = require('@utils/Embed'); var _Embed2 = _interopRequireDefault(_Embed);


 async function setupMainChannel(
  t,
  guild,
  channel,
  guildData,
  category,
  role,
) {
  const channelData = {
    permissionOverwrites: [
      {
        id: guild,
        deny: ['SEND_MESSAGES', 'ADD_REACTIONS'],
      },
    ],
  };

  if (guildData.data.ticket && guildData.data.ticket.categoryId) {
    channelData.parent = guildData.data.ticket.categoryId;
    channelData.position = 0;
  }

  await channel.edit(channelData);

  const embed = new (0, _Embed2.default)(guild.client.user).setAuthor("Ticket's").setDescription(t('modules:ticket.main_message'));
  if (guild.iconURL) embed.setThumbnail(guild.iconURL);

  const msg = await channel.send(embed);

  if (msg instanceof _discordjs.Message) {
    msg.react(_Constants.TICKET_EMOJIS.QUESTION);
    msg.react(_Constants.TICKET_EMOJIS.REPORT);
    msg.react(_Constants.TICKET_EMOJIS.REVIEW);
    await guildData.updateTicket({
      active: true,
      messageId: msg.id,
      channelId: channel.id,
      role: role ? role.id : '',
      categoryId: category ? category.id : '',
    });
  }
} exports.setupMainChannel = setupMainChannel;
