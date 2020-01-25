import { Document } from 'mongoose'

class BaseController<Doc extends Document> {
  readonly data: Doc

  constructor (data: Doc) {
    this.data = data
  }

  updateData<C, O extends C>(update: C, old: O) {
    return Object.assign(old, update)
  }

  updateDataInArray<O, K extends keyof O>(update: O, list: O[], keySearch: K): O[] {
    const findIndex = list.findIndex(x => x[keySearch] === update[keySearch])
    if (findIndex >= 0) {
      list[findIndex] = this.updateData(list[findIndex], update)
    } else {
      list.push(update)
    }
    return list
  }

  addArrayData<D>(data: D, arr: D[]): D[] {
    if (data && arr && !arr.includes(data)) {
      arr.push(data)
    }
    return arr
  }

  removeArrayData<D>(data: D, arr: D[]): D[] {
    if (data && arr && arr.includes(data)) {
      return arr.filter(x => x !== data)
    }
    return arr
  }
}

export default BaseController;