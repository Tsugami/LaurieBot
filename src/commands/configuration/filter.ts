import ModuleCommand, { ModuleOptionArgs } from '@struct/ModuleCommand';

const validate = (_: any, { guildData }: ModuleOptionArgs) => guildData.wordFilter.get().length !== 0;
const parse = (words: string[]) => words.map(w => `\`${w}\``).join(', ');

type StringArgs = ModuleOptionArgs & { words: string };
export default new ModuleCommand(
  'filter',
  'filtro',
  {
    aliases: ['filtro'],
    userPermissions: 'MANAGE_GUILD',
    channelRestriction: 'guild',
  },
  [
    {
      id: 'add',
      aliases: ['adicionar'],
      validate: (_, { guildData }) => guildData.wordFilter.get().length <= guildData.wordFilter.WORDS_LIMIT,
      async run(msg, t, { guildData, words }: StringArgs) {
        const wordsAdded = parse(await guildData.wordFilter.add(words));
        if (wordsAdded.length) msg.reply(t('commands:filter.added', { words: wordsAdded }));
        msg.reply('');
      },
    },
    {
      id: 'remove',
      aliases: ['desativar'],
      validate,
      async run(msg, t, { guildData, words }: StringArgs) {
        const wordsRemoved = parse(await guildData.wordFilter.remove(words));
        msg.reply(t('commands:filter.removed', { words: wordsRemoved }));
      },
    },
    {
      id: 'list',
      aliases: ['lista'],
      validate,
      async run(msg, t, { guildData }) {
        const words = parse(guildData.wordFilter.get());
        msg.reply(t('commands:filter.list', { words }));
      },
    },
    {
      id: 'clean',
      aliases: ['limpar'],
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
);
