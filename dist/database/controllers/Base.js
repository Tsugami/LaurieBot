"use strict";Object.defineProperty(exports, "__esModule", {value: true});



class BaseController {
  

  constructor(data) {
    this.data = data;
  }

  updateData(update, old) {
    return Object.assign(old, update);
  }

  updateDataInArray(update, list, fnSearch) {
    const findIndex = list.findIndex(fnSearch);
    if (findIndex >= 0) {
      list[findIndex] = { ...list[findIndex], ...update };
    } else {
      list.push(update);
    }
    return list;
  }

  addArrayData(data, arr) {
    if (data && arr && !arr.includes(data)) {
      arr.push(data);
    }
    return arr;
  }

  removeArrayData(data, arr) {
    if (data && arr && arr.includes(data)) {
      return arr.filter(x => x !== data);
    }
    return arr;
  }
}

exports. default = BaseController;
