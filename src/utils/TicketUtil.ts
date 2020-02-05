import { TICKET_EMOJIS, Emojis } from '@utils/Constants';
import { CategoryTypes } from '@database/models/Guild';

export const TicketNameRegex = /ticket-([0-9])/;

export function isTicketEmoji(emoji: string): boolean {
  return emoji === TICKET_EMOJIS.QUESTION || emoji === TICKET_EMOJIS.REPORT || emoji === TICKET_EMOJIS.REVIEW;
}

export function getCategoryByEmoji(emoji: string): CategoryTypes | null {
  if (emoji === TICKET_EMOJIS.QUESTION) return 'question';
  if (emoji === TICKET_EMOJIS.REPORT) return 'report';
  if (emoji === TICKET_EMOJIS.REVIEW) return 'review';
  return null;
}

export function getEmojiByCategory(category: CategoryTypes): Emojis {
  if (category === 'question') return TICKET_EMOJIS.QUESTION;
  if (category === 'report') return TICKET_EMOJIS.REPORT;
  return TICKET_EMOJIS.REVIEW;
}
