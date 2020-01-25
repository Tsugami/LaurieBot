import Base from './Base'
import { GuildDocument, WelcomeModule, TicketModule } from '../models/Guild'

class GuildController<T extends GuildDocument = GuildDocument> extends Base<T> {
  private async save (): Promise<T> {
    await this.data.save()
    return this.data
  }

  updateWelcome (data: WelcomeModule): Promise<T> {
    this.data.welcome = this.updateDataInArray(data, this.data.welcome, 'channelId')
	  return this.save()
  }

  disableChannel (channelId: string): Promise<T> {
    this.data.disableChannels = this.addArrayData(channelId, this.data.disableChannels)
    return this.save()
  }

  enableChannel (channelId: string): Promise<T> {
    this.data.disableChannels = this.removeArrayData(channelId, this.data.disableChannels)
    return this.save()
  }

  addPenaltyChannel (channelId: string): Promise<T> {
    this.data.penaltyChannels = this.addArrayData(channelId, this.data.penaltyChannels)
    return this.save()
  }

  removePenaltyChannel (channelId: string): Promise<T> {
    this.data.penaltyChannels = this.removeArrayData(channelId, this.data.penaltyChannels)
    return this.save()
  }

  updateTicket (data: TicketModule): Promise<T> {
    if (this.data.ticket) {
      this.data.ticket = this.updateData(data, this.data.ticket)
    } else {
      this.data.ticket = data
    }
    return this.save()
  }

}

export default GuildController