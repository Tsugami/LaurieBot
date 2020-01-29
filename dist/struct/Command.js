"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }








var _discordakairo = require('discord-akairo');

var _i18next = require('i18next'); var _i18next2 = _interopRequireDefault(_i18next);
var _index = require('@database/index');










// eslint-disable-next-line @typescript-eslint/no-unused-vars
 function getFixedT(msg) {
  const language = 'pt-BR';
  return _i18next2.default.getFixedT(language);
} exports.getFixedT = getFixedT;



 function Prompt(
  fn,
  options = {},
) {
  if (typeof fn === 'string') return (msg) => getFixedT(msg)(fn, options);
  return (msg, args, tries) => fn(getFixedT(msg), msg, args, tries);
} exports.Prompt = Prompt;

 function PromptOptions(
  options,
  tOptions = {},
) {
  return (msg, args) => getFixedT(msg)(options[args.option], tOptions);
} exports.PromptOptions = PromptOptions;

 class CustomCommand extends _discordakairo.Command {
  constructor(id, options) {
    super(id, { ...options });
  }

  

  exec(msg, args, edited) {
    const t = getFixedT(msg);
    return this.run(msg, t, args, edited);
  }
} exports.default = CustomCommand;
// guild data argument
 const guildDataArg = {
  id: 'guildData',
  type: (_, msg) => _index.guild.call(void 0, msg.guild.id),
}; exports.guildDataArg = guildDataArg;
// options argument








const cancelOption = {
  key: 'cancel',
  aliases: ['cancelar'],
  message: 'commons:cancel',
};

 const defineOptions = (options) => [...options, cancelOption]; exports.defineOptions = defineOptions;



 function getArgumentAkairo(
  client,
  key,
  options,
  defaultR = '',
) {
  return (...args) => {
    const x = options.find(o => (Array.isArray(o[0]) && o[0].includes(key)) || o[0] === key);
    if (x) {
      if (typeof x[1] === 'string') return client.commandHandler.resolver.type(x[1])(...args) || null;
    }
    return defaultR;
  };
} exports.getArgumentAkairo = getArgumentAkairo;

 function optionsArg(
  id,
  options,
  title,
  promptOptions = {},
) {
  const optionsParsed = (m, a) => options.filter(o => !o.parse || o.parse(m, a));

  const fillPromptEmpty = (key) => {
    if (!promptOptions[key]) promptOptions[key] = Prompt(`commons:prompt_options_default.${key}`);
  };

  fillPromptEmpty('retry');
  fillPromptEmpty('timeout');
  fillPromptEmpty('ended');
  fillPromptEmpty('cancel');

  return {
    id,
    type: (word, m, a) => {
      const option = optionsParsed(m, a).find(
        (x, i) => Number(word) === i + 1 || word === x.key || x.aliases.includes(word),
      );
      if (option) return option.key;
      return null;
    },
    prompt: {
      ...promptOptions,
      start: (m, a, t) =>
        `${title(m, a, t)}\n${optionsParsed(m, a)
          .map((o, i) => {
            return `**${i + 1}**: ${typeof o.message === 'string' ? Prompt(o.message)(m) : o.message(m, a)}`;
          })
          .join('\n')}`,
    },
  };
} exports.optionsArg = optionsArg;
