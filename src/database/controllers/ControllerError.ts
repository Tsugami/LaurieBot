export const ERROR_MESSAGES = [
  'module:ticket.already_has_ticket_open',
  'module:ticket.this_is_the_current_ticket_role',
] as const;

export default class ControllerError extends Error {
  // eslint-disable-next-line no-useless-constructor
  constructor(public t: typeof ERROR_MESSAGES[number]) {
    super(t);
  }
}
