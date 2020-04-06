import { Document, Types } from 'mongoose';

export type findFn<V> = (v: V, i: number, arr: V[]) => boolean;

class BaseController<Doc extends Document> {
  readonly data: Doc;

  constructor(data: Doc) {
    this.data = data;
  }

  async save() {
    await this.data.save();
    return this.data;
  }

  isId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }
}

export default BaseController;
