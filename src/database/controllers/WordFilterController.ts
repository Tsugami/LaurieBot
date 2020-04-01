import { GuildDocument } from '@database/models/Guild';
import Base from './Base';

class WordFilterController extends Base<GuildDocument> {
  readonly WORDS_LIMIT = 30;

  private parseWords(words: string): string[] {
    return words
      .trim()
      .split(', ')
      .map(w => w.toLowerCase());
  }

  async add(words: string) {
    const wordsParsed = this.parseWords(words).filter(w => !this.data.wordFilter.includes(w));
    this.data.wordFilter = this.data.wordFilter.concat(wordsParsed);
    await this.save();
    return wordsParsed;
  }

  async remove(words: string) {
    const wordsParsed = this.parseWords(words).filter(w => this.data.wordFilter.includes(w));
    this.data.wordFilter = this.data.wordFilter.filter(w => !wordsParsed.includes(w.toLowerCase()));
    await this.save();
    return wordsParsed;
  }

  clean() {
    this.data.wordFilter = [];
    return this.save();
  }

  get() {
    return this.data.wordFilter;
  }
}

export default WordFilterController;
