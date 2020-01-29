"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _discordakairo = require('discord-akairo');

var _categories = require('@categories');


var _TicketUtil = require('@ticket/TicketUtil');
var _Embed = require('@utils/Embed'); var _Embed2 = _interopRequireDefault(_Embed);
var _Text = require('@utils/Text'); var _Text2 = _interopRequireDefault(_Text);
var _Date = require('@utils/Date');
var _Constants = require('@utils/Constants');







class TicketInfoCommand extends _discordakairo.Command {
  constructor() {
    super('ticket-info', {
      aliases: ['ticket-info'],
      category: _categories.TicketCategory,
      channelRestriction: 'guild',
      args: [
        {
          id: 'ticket',
          type: (w, msg, args) => _TicketUtil.findTicketTypeArg.call(void 0, w, msg, args, this.client.commandHandler.resolver.type, false),
          prompt: {
            start: `digite o id/dono/canal do ticket.`,
            retry: 'input invalido.',
          },
        },
      ],
      defaultPrompt: {
        cancelWord: 'cancelar',
        cancel: 'Comando cancelado.',
      },
    });
  }

  async exec(msg, args) {
    if (args.ticket === 'desabilidado') {
      return msg.reply("esse comando só está disponivel com os ticket's ativo.");
    }
    if (args.ticket === 'no-tickets') {
      return msg.reply('não tem nenhum ticket existente.');
    }
    if (args.ticket === 'user-no-ticket') {
      return msg.reply('tente executar o comando denovo com id do seu ticket.');
    }
    if (args.ticket === 'user-no-perm') {
      return msg.reply("você não tem permissão para visualizar ticket's.");
    }

    if (!args.ticket) return msg.reply('ticket invalido.');

    console.log(args.ticket);

    const { ticket } = args.ticket;
    const { client } = msg;

    const getUser = async (id) => client.users.get(id) || client.fetchUser(id).catch(() => null);
    const getName = (user) => (user ? user.username : 'Desconhecido');

    const openUser = await getUser(msg.author.id);

    const categoryEmoji = ticket.category ? _TicketUtil.getEmojiByCategory.call(void 0, ticket.category) : _Constants.Emojis.UNKNOWN;
    const categoryPt = ticket.category == 'question' ? 'Duvida' : ticket.category === 'report' ? 'Report' : 'Revisão';
    const created = ticket.createdAt ? _Date.getDate.call(void 0, ticket.createdAt) : '';

    const status = ticket.closed ? 'Fechado' : 'Aberto';
    const statusEmoji = ticket.closed ? _Constants.Emojis.LOCK : _Constants.Emojis.UNLOCK;

    const rank = typeof ticket.rating === 'number' ? ticket.rating : 'Não declarada';
    const rankEmoji =
      typeof ticket.rating === 'number'
        ? ticket.rating > 5
          ? _Constants.Emojis.STRONKS
          : _Constants.Emojis.NOT_STRONKS
        : _Constants.Emojis.NOT_STRONKS;

    const usersCount = ticket.users ? ticket.users.length : 0;

    const text = new (0, _Text2.default)()
      .addTitle(_Constants.Emojis.FOLDER, 'INFORMAÇÕES DO TICKET')
      .addField(categoryEmoji, 'Categoria', categoryPt)
      .addField(_Constants.Emojis.PERSON, 'Criado por', getName(openUser))
      .addField(_Constants.Emojis.CALENDER, 'Criado em', created)
      .addField(statusEmoji, 'Status', status)
      .addField(rankEmoji, 'Nota', rank)
      .addField(_Constants.Emojis.PERSONS, 'Participantes', usersCount);

    if (!ticket.closed) {
      const channel = msg.guild.channels.get(ticket.channelId);
      if (channel) text.addField(_Constants.Emojis.SPEECH_BALLON, 'Canal', channel.toString());
    } else {
      const user = ticket.closedBy === ticket.authorId ? openUser : ticket.closedBy && (await getUser(ticket.closedBy));
      const date = ticket.closedAt && _Date.getDate.call(void 0, ticket.closedAt);

      if (user) text.addField(_Constants.Emojis.PERSON, 'Fechado por', getName(user));
      if (date) text.addField(_Constants.Emojis.CALENDER, 'Fechado em', date);
    }

    const embed = new (0, _Embed2.default)(msg.author).setDescription(text);

    if (openUser) embed.setThumbnail(openUser.displayAvatarURL);

    return msg.reply(embed);
  }
}

exports. default = TicketInfoCommand;
