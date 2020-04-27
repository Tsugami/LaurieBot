import { TICKET_EMOJIS, EmojiType } from '@utils/constants';
import { CategoryTypes } from '@database/models/Guild';

export default class TicketUtil {
  public static TICKET_NAME_REGEX = /ticket-([0-9])/;

  public static isTicketEmoji(emoji: string): boolean {
    return emoji === TICKET_EMOJIS.QUESTION || emoji === TICKET_EMOJIS.REPORT || emoji === TICKET_EMOJIS.REVIEW;
  }

  public static getCategoryByEmoji(emoji: string): CategoryTypes | null {
    if (emoji === TICKET_EMOJIS.QUESTION) return 'question';
    if (emoji === TICKET_EMOJIS.REPORT) return 'report';
    if (emoji === TICKET_EMOJIS.REVIEW) return 'review';
    return null;
  }

  public static getEmojiByCategory(category: CategoryTypes): EmojiType {
    if (category === 'question') return TICKET_EMOJIS.QUESTION;
    if (category === 'report') return TICKET_EMOJIS.REPORT;
    return TICKET_EMOJIS.REVIEW;
  }
}
