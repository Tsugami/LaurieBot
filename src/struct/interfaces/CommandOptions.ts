import { CommandOptions } from 'discord-akairo';
import categories from '../categories';

export interface CustomCommandOptions extends CommandOptions {
  category: keyof typeof categories;
}

type RunFunction = (msg: Message, t: TFunction, args: any, edited: boolean) => any;

type CmdOptions = Omit<CommandOptions, 'defaultPrompt'>;

interface LaurieCommandOptions extends CmdOptions {
  category: keyof typeof categories;
}
