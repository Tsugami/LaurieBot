import { CommandOptions, ArgumentType, ArgumentOptions } from 'discord-akairo';
import categories from '../categories';

export type CustomArgumentType = ArgumentType | 'categoryChannel';
export interface CustomArgumentOptions extends ArgumentOptions {
  type: CustomArgumentType;
}
export interface CustomCommandOptions extends CommandOptions {
  category: keyof typeof categories;
  help: string;
  args?: CustomArgumentOptions[];
}
