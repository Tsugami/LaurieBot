/* eslint-disable no-return-await */
import { AkairoHandler } from 'discord-akairo';
import LaurieCommand from '@structures/LaurieCommand';
import { Message, Collection } from 'discord.js';
import GuildController from '@database/controllers/GuildController';
import ModuleOption from './Option';

export default class ModuleOptionsHandler extends AkairoHandler {
  modules: Collection<string, ModuleOption>;

  constructor(public command: LaurieCommand, directory: string) {
    super(command.client, { directory, classToHandle: ModuleOption });
  }

  register(mod: ModuleOption, filepath?: string) {
    super.register(mod, filepath);
    mod.command = this.command;
  }

  runCollector(message: Message, guildData: GuildController) {
    const collector = message.channel.createMessageCollector(this.collectorFilter(message));
    const options = this.getOptionsAvailable(message, guildData);

    const previousMessage = this.sendOptionsMessage(options);
    let failed: 0;

    collector.on('collect', (msg: Message) => {});

    collector.on('end', (collected, reason) => {});
  }

  collectorFilter(message: Message) {
    return (msg: Message) => msg.author.id === message.author.id;
  }

  getOptionsAvailable(message: Message, guildData: GuildController) {
    return this.modules.array().filter(async m => {
      return await m.validate(message, guildData);
    });
  }

  sendOptionsMessage(optionsAvailable: ModuleOption[]) {}
}
