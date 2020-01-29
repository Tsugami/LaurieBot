"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _Command = require('@struct/Command'); var _Command2 = _interopRequireDefault(_Command);

class PingCommand extends _Command2.default {
  constructor() {
    super('ping', {
      aliases: ['ping'],
      category: 'discord',
    });
  }

  async run(message) {
    const sent = await message.channel.send('Pong!');
    if (Array.isArray(sent)) return;

    const timeDiff = (sent.editedAt || sent.createdAt) - (message.editedAt || message.createdAt);
    const text = `🔂\u2000**RTT**: ${timeDiff} ms\n💟\u2000**Heartbeat**: ${Math.round(this.client.ping)} ms`;
    sent.edit(`Pong!\n${text}`);
  }
}

module.exports = PingCommand;
