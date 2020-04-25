import ModuleCommand from '@structures/ModuleCommand/ModuleCommand';

export default class CommandConfig extends ModuleCommand {
  constructor() {
    super(
      'cmdconfig',
      {
        editable: false,
        category: 'configuration',
        lock: 'guild',
        aliases: ['configurarcmds'],
        userPermissions: ['ADMINISTRATOR'],
        clientPermissions: ['MANAGE_MESSAGES'],
      },
      `${__dirname}/@cmdconfig`,
    );
  }
  //   (m, guildData) => {
  //     const channels = (m.guild as Guild).channels.cache.filter(c => c.type === 'text');
  //     const filter = (c: GuildChannel) => !guildData.disabledChannels.includes(c.id);
  //     return {
  //       id: 'disable_channel',
  //       validate: true,
  //       args: [
  //         {
  //           id: 'channel',
  //           type: Argument.validate('textChannel', (c, p, v: TextChannel) => filter(v)),
  //           prompt: configPrompt(
  //             `${this.tPath}.args.channel.disable_channel`,
  //             channels
  //               .filter(filter)
  //               .map(c => c.toString())
  //               .join(' '),
  //           ),
  //         },
  //       ],
  //       run: async (msg, data, { channel }: { channel: TextChannel }) => {
  //         await data.enableChannel(channel.id);
  //         return msg.reply(msg.t(`${this.tPath}.disabled_channel`, { channel: channel.toString() }));
  //       },
  //     };
  //   },
  //   (m, guildData),
  //       id: 'enabled',
  //       validate,
  //       async run(msg, t, { guildData, channel }: ChannelArgs) {
  //         if (guildData.disabledChannels.includes(channel.id)) {
  //           return msg.reply(t('commands:cmdconfig.already_disabled_channel'));
  //         }
  //         await guildData.disableChannel(channel.id);
  //         return msg.reply(t('commands:cmdconfig.disabled_channel', { channel: channel.toString() }));
  //       },
  //     },
  //     {
  //       id: 'enable_channel',
  //       validate,
  //       async run(msg, t, { guildData, channel }: ChannelArgs) {
  //         await guildData.enableChannel(channel.id);
  //         return msg.reply(t('commands:cmdconfig.enabled_channel', { channel: channel.toString() }));
  //       },
  //         //     },
  //       },
  //       (embed, { t, guild }, { disabledChannels, disabledCommands }) => {
  //         const commands = disabledCommands.map(c => `\`${c}\``).join(', ') || t('commands:cmdconfig.none_commands');
  //         embed.addField(t('commands:cmdconfig.disabled_commands'), commands);

  //         embed.addField(
  //           t('commands:cmdconfig.disabled_channels'),
  //           disabledChannels.map(id => guild?.channels.cache.get(id)?.toString() ?? id).join(', ') ||
  //             t('commands:cmdconfig.none_channels'),
  //         );

  //         return embed;
  //       },
  //       //     );
  //     ],
  //     (embed, m, guildData) => {
  //       embed
  //         .addField(
  //           m.t('commands:cmdconfig.disabled_commands'),
  //           guildData.disabledCommands
  //             .filter(c => c)
  //             .map(c => `\`${c}\``)
  //             .join(', ') || m.t('commands:cmdconfig.none_commands'),
  //         )
  //         .addField(
  //           m.t('commands:cmdconfig.disabled_channels'),
  //           guildData.disabledChannels
  //             .map(id => m.guild?.channels.cache.get(id)?.toString())
  //             // removing deleted channels
  //             .filter(c => c)
  //             .join(', ') || m.t('commands:cmdconfig.none_channels'),
  //         );
  //       return embed;
  //     },
  //   );
  // }
}
