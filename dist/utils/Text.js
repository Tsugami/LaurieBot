"use strict";Object.defineProperty(exports, "__esModule", {value: true});

class Text {constructor() { Text.prototype.__init.call(this); }
   __init() {this.description = ''}

  addTitle(emoji, title) {
    this.description += `${emoji} **${title.toUpperCase()}**\n\n`;
    return this;
  }

  addField(emoji, key, value, skip = true) {
    this.description += `${emoji} **${key}**: ${value}`;
    if (skip) this.skip();
    return this;
  }

  skip() {
    this.description += '\n';
    return this;
  }

  get desc() {
    return this.description;
  }

  toString() {
    return this.description;
  }

  toJSON() {
    return this.description;
  }
}

exports. default = Text;
