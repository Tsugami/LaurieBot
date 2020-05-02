import ModuleCommand from '@structures/ModuleCommand';
import { Role } from 'discord.js';
import LaurieEmbed from '../../structures/LaurieEmbed';

interface Args {
  role: Role;
}

export default class CmdConfig extends ModuleCommand {
  constructor() {
    super(
      'autorole',
      [
        {
          id: 'enable',
          validate(_, guildData) {
            return !guildData.autoroleID;
          },
          async run(msg, guildData, { role }: Args) {
            if (Number(msg.member?.roles.highest.position) < role.position) {
              return msg.reply(new LaurieEmbed(null, msg.t(`${this.tPath}.isHighestRole`)));
            }
            await guildData.setAutorole(role.id);
            msg.reply(new LaurieEmbed(null, msg.t(`${this.tPath}.enabled`)));
          },
        },
        {
          id: 'disable',
          validate(_, guildData) {
            return !!guildData.autoroleID;
          },
          async run(msg, guildData) {
            await guildData.setAutorole();
            msg.reply(new LaurieEmbed(null, msg.t(`${this.tPath}.disabled`)));
          },
        },
        {
          id: 'change_role',
          validate(_, guildData) {
            return !!guildData.autoroleID;
          },
          async run(msg, guildData, { role }: Args) {
            if (Number(msg.member?.roles.highest.position) < role.position) {
              return msg.reply(new LaurieEmbed(null, msg.t(`${this.tPath}.isHighestRole`)));
            }
            await guildData.setAutorole(role.id);
            msg.reply(new LaurieEmbed(null, msg.t(`${this.tPath}.changed`)));
          },
        },
      ],
      [[['enable', 'change_role'], { id: 'role', type: 'role' }]],
      {
        userPermissions: ['ADMINISTRATOR'],
        channel: 'guild',
      },
      (embed, msg, guildData) => {
        const roleName = guildData.autoroleID && msg.guild?.roles.cache.get(guildData.autoroleID)?.name;
        if (roleName) embed.addField(msg.t(`${this.tPath}.role`), roleName);
      },
    );
  }
}
