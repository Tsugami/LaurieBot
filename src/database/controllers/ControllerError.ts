export const ERROR_MESSAGES = ['already_has_ticket_open', 'this_is_the_current_ticket_role'] as const;

export default class ControllerError extends Error {
  // eslint-disable-next-line no-useless-constructor
  constructor(error: typeof ERROR_MESSAGES[number]) {
    super(error);
  }
}
