import { CommandOptions } from 'discord-akairo';
import categories from '../categories';

export interface CustomCommandOptions extends CommandOptions {
  category: keyof typeof categories;
  help: string;
}
