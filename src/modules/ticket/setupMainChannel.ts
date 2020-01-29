import { Guild, TextChannel, ChannelData, Message, Role, CategoryChannel } from 'discord.js';
import GuildController from '@database/controllers/GuildController';
import { TICKET_EMOJIS } from '@utils/Constants';
import Embed from '@utils/Embed';
import { TFunction } from '@struct/Command';

export async function setupMainChannel(
  t: TFunction,
  guild: Guild,
  channel: TextChannel,
  guildData: GuildController,
  category?: CategoryChannel,
  role?: Role,
) {
  const channelData: ChannelData = {
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

  const embed = new Embed(guild.client.user).setAuthor("Ticket's").setDescription(t('modules:ticket.main_message'));
  if (guild.iconURL) embed.setThumbnail(guild.iconURL);

  const msg = await channel.send(embed);

  if (msg instanceof Message) {
    msg.react(TICKET_EMOJIS.QUESTION);
    msg.react(TICKET_EMOJIS.REPORT);
    msg.react(TICKET_EMOJIS.REVIEW);
    await guildData.updateTicket({
      active: true,
      messageId: msg.id,
      channelId: channel.id,
      role: role ? role.id : '',
      categoryId: category ? category.id : '',
    });
  }
}
