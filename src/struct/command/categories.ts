import { Category } from 'discord-akairo';
import { EMOJIS, EmojiType } from '@utils/Constants';

import Command from './Command';

export class CustomCategory extends Category<string, Command> {
  constructor(id: string, public emoji: EmojiType) {
    super(id, []);
  }
}

export default {
  discord: new CustomCategory('discord', EMOJIS.DISCORD),
  bot: new CustomCategory('bot', EMOJIS.ROBOT),
  interactivity: new CustomCategory('interactivity', EMOJIS.RINDO_DOIDO),
  minecraft: new CustomCategory('minecraft', EMOJIS.MINECRAFT),
  moderator: new CustomCategory('moderator', EMOJIS.POLICE_OFFICER),
  configuration: new CustomCategory('configuration', EMOJIS.GEAR),
  ticket: new CustomCategory('ticket', EMOJIS.TICKET),
};
