import { Document } from 'mongoose';

export type findFn<V> = (v: V, i: number, arr: V[]) => boolean;

class BaseController<Doc extends Document> {
  readonly data: Doc;

  constructor(data: Doc) {
    this.data = data;
  }

  updateData<C, O extends C>(update: C, old: O) {
    return Object.assign(old, update);
  }

  updateDataInArray<O>(update: O, list: O[], fnSearch: findFn<O>): O[] {
    const findIndex = list.findIndex(fnSearch);
    if (findIndex >= 0) {
      list[findIndex] = { ...list[findIndex], ...update };
    } else {
      list.push(update);
    }
    return list;
  }

  addArrayData<D>(data: D, arr: D[]): D[] {
    if (data && arr && !arr.includes(data)) {
      arr.push(data);
    }
    return arr;
  }

  removeArrayData<D>(data: D, arr: D[]): D[] {
    if (data && arr && arr.includes(data)) {
      return arr.filter(x => x !== data);
    }
    return arr;
  }
}

export default BaseController;
