import { Category } from 'discord-akairo';
import { Emojis } from '@utils/Constants';

import Command from './Command';

export class CustomCategory extends Category<string, Command> {
  emoji: Emojis;

  constructor(id: string, emoji: Emojis) {
    super(id, []);
    this.emoji = emoji;
  }
}

export default {
  discord: new CustomCategory('discord', Emojis.DISCORD),
  bot: new CustomCategory('bot', Emojis.ROBOT),
  interactivity: new CustomCategory('interactivity', Emojis.RINDO_DOIDO),
  minecraft: new CustomCategory('minecraft', Emojis.MINECRAFT),
  moderator: new CustomCategory('moderator', Emojis.POLICE_OFFICER),
  configuration: new CustomCategory('configuration', Emojis.GEAR),
  ticket: new CustomCategory('ticket', Emojis.TICKET),
};
