import { TFunction } from 'i18next';

declare module 'discord.js' {
  interface Message {
    t: TFunction;
  }
}
