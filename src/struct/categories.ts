import { Category } from 'discord-akairo';

class CustomCategory extends Category<any, any> {
  constructor(id: string) {
    super(id, []);
  }
}

export default {
  discord: new CustomCategory('discord'),
  interactivity: new CustomCategory('interactivity'),
  minecraft: new CustomCategory('minecraft'),
  moderator: new CustomCategory('moderator'),
  configuration: new CustomCategory('configuration'),
  ticket: new CustomCategory('ticket'),
};
