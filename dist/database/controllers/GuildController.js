"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _Base = require('./Base'); var _Base2 = _interopRequireDefault(_Base);

class GuildController extends _Base2.default {
   async save() {
    await this.data.save();
    return this.data;
  }

  updateWelcome(data) {
    this.data.welcome = data;
    return this.save();
  }

  disableWelcome() {
    this.data.welcome = null;
    return this.save();
  }

  disableChannel(channelId) {
    this.data.disableChannels = this.addArrayData(channelId, this.data.disableChannels);
    return this.save();
  }

  enableChannel(channelId) {
    this.data.disableChannels = this.removeArrayData(channelId, this.data.disableChannels);
    return this.save();
  }

  addPenaltyChannel(channelId) {
    this.data.penaltyChannels = this.addArrayData(channelId, this.data.penaltyChannels);
    return this.save();
  }

  removePenaltyChannel(channelId) {
    this.data.penaltyChannels = this.removeArrayData(channelId, this.data.penaltyChannels);
    return this.save();
  }

  updateTicket(data) {
    if (this.data.ticket) {
      this.data.ticket = this.updateData(data, this.data.ticket);
    } else {
      this.data.ticket = this.updateData(data, this.data.ticket);
    }
    return this.save();
  }

  updateTickets(data) {
    if (this.data.ticket) {
      const dataObj = this.data.toObject();
      const fn = x => x.authorId === data.authorId && !x.closed && x.channelId === data.channelId;
      this.data.ticket.tickets = this.updateDataInArray(data, dataObj.ticket.tickets || [], fn);
      return this.data.save();
    }
    return this.data;
  }

  deleteTicketModule() {
    this.data.ticket = { channelId: '' };
    return this.save();
  }
}

exports. default = GuildController;
