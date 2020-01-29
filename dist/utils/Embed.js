"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _discordjs = require('discord.js');
var _Constants = require('./Constants');

 class Embed extends _discordjs.RichEmbed {
  constructor(author) {
    super();
    this.setFooter(`Por ${author.username}`, author.displayAvatarURL);
    this.setColor(_Constants.EMBED_DEFAULT_COLOR);
    this.setTimestamp();
  }
} exports.default = Embed;
