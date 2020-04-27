import ModuleCommand from '@structures/ModuleCommand';

const parse = (words: string[]) => words.map(w => `\`${w}\``).join(', ');

export default class Filter extends ModuleCommand {
  constructor() {
    super(
      'filter',
      [
        {
          id: 'add',
          validate: (_, guildData) => guildData.wordFilter.get().length <= guildData.wordFilter.WORDS_LIMIT,
          async run(msg, guildData, { words }: { words: string }) {
            const wordsAdded = parse(await guildData.wordFilter.add(words));
            if (wordsAdded.length) msg.reply(msg.t('commands:filter.added', { words: wordsAdded }));
          },
        },
        {
          id: 'remove',
          validate: (_, guildData) => guildData.wordFilter.get().length !== 0,
          async run(msg, guildData, { words }: { words: string }) {
            const wordsRemoved = parse(await guildData.wordFilter.remove(words));
            msg.reply(msg.t('commands:filter.removed', { words: wordsRemoved }));
          },
        },
        {
          id: 'clean',
          validate: (_, guildData) => guildData.wordFilter.get().length !== 0,
          async run(msg, guildData) {
            await guildData.wordFilter.clean();
            msg.reply(msg.t('commands:filter.clean'));
          },
        },
      ],
      [[['add', 'remove'], { id: 'words', type: 'string', match: 'rest' }]],
      {
        aliases: ['filtro'],
        userPermissions: 'MANAGE_GUILD',
        channel: 'guild',
      },
      (embed, msg, guildData) => {
        if (guildData.wordFilter.get().length !== 0) {
          embed.addField(msg.t('commands:filter.words_added'), parse(guildData.wordFilter.get()));
        }
      },
    );
  }
}
