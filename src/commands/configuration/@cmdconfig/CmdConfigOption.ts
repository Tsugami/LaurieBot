// import ModuleOptions from '@structures/ModuleCommand/Option';
// import { CATEGORIES_THAT_CANNOT_BE_DISABLED, COMMANDS_THAT_CANNOT_BE_DISABLED } from '@utils/constants';
// import LaurieEmbed from '../../../structures/LaurieEmbed';

// export default class DisableCommand extends ModuleOptions {
//   description: string;

//   get categoriesBanned() {
//     return CATEGORIES_THAT_CANNOT_BE_DISABLED;
//   }

//   get commandsBanned() {
//     return COMMANDS_THAT_CANNOT_BE_DISABLED;
//   }

//   prompts(argId: string, description = this.description) {
//     return {
//       start: this.prompt(argId, description),
//       retry: this.prompt(argId, description),
//     };
//   }

//   prompt(argId: string, description = this.description) {
//     return {
//       content: `${this.message.author.toString()}, ${this.message.t('commons:tryCancel')}`,
//       embed: new LaurieEmbed(
//         this.message.author,
//         this.message.t(`${this.command.tPath}.args.${argId}.${this.id}`),
//         description,
//       ),
//     };
//   }
// }
