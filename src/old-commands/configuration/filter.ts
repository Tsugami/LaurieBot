import ModuleCommand, { ModuleOptionArgs } from '@struct/command/ModuleCommand';

const validate = (_: any, { guildData }: ModuleOptionArgs) => guildData.wordFilter.get().length !== 0;
const parse = (words: string[]) => words.map(w => `\`${w}\``).join(', ');

type StringArgs = ModuleOptionArgs & { words: string };
export default ModuleCommand(
  'filter',
  {
    aliases: ['filtro'],
    userPermissions: 'MANAGE_GUILD',
    channelRestriction: 'guild',
  },
  [
    {
      id: 'add',
      validate: (_, { guildData }) => guildData.wordFilter.get().length <= guildData.wordFilter.WORDS_LIMIT,
      async run(msg, t, { guildData, words }: StringArgs) {
        const wordsAdded = parse(await guildData.wordFilter.add(words));
        if (wordsAdded.length) msg.reply(t('commands:filter.added', { words: wordsAdded }));
      },
    },
    {
      id: 'remove',
      validate,
      async run(msg, t, { guildData, words }: StringArgs) {
        const wordsRemoved = parse(await guildData.wordFilter.remove(words));
        msg.reply(t('commands:filter.removed', { words: wordsRemoved }));
      },
    },
    {
      id: 'clean',
      validate,
      async run(msg, t, { guildData }) {
        await guildData.wordFilter.clean();
        msg.reply(t('commands:filter.clean'));
      },
    },
  ],
  {
    words: ['string', ['add', 'remove'], { match: 'rest' }],
  },
  (msg, t, { guildData }) => {
    return validate(msg, { guildData }) ? [[t('commands:filter.words_added'), parse(guildData.wordFilter.get())]] : [];
  },
);
