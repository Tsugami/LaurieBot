import { Signale } from 'signale';

const logger = new Signale({
  types: {
    command: {
      badge: '💬',
      color: 'gray',
      label: 'command',
      logLevel: 'debug',
    },
  },
});

export default logger;
