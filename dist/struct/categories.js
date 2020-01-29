"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _discordakairo = require('discord-akairo');

class CustomCategory extends _discordakairo.Category {
  constructor(id) {
    super(id, []);
  }
}

exports. default = {
  discord: new CustomCategory('discord'),
  interactivity: new CustomCategory('interactivity'),
  minecraft: new CustomCategory('minecraft'),
  moderator: new CustomCategory('moderator'),
  configuration: new CustomCategory('configuration'),
  ticket: new CustomCategory('ticket'),
};
