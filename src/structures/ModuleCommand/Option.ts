/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message } from 'discord.js';
import GuildController from '@database/controllers/GuildController';
import LaurieCommand from '@structures/LaurieCommand';
import { ArgumentOptions, AkairoModule } from 'discord-akairo';
import ModuleOptionsHandler from './OptionsHandler';

export default abstract class ModuleOptions extends AkairoModule {
  public command: LaurieCommand;

  public handler: ModuleOptionsHandler;

  constructor(id: string, public aliases = [], public args: ArgumentOptions[] = []) {
    super(id);
  }

  abstract description(): string;

  abstract run(message: Message, guildData: GuildController, alias: string, args: any): any;

  validate(message: Message, guildData: GuildController): boolean | Promise<boolean> {
    return true;
  }

  tPath() {
    return `commands:${this.command}. `;
  }
}
