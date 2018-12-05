import merge from 'ramda/src/merge';
import { execute } from './executor';

class Xform {
  constructor() {
    this.$ = {};
  }

  getExternals() {
    return this.$;
  }

  setExternals(ext = {}) {
    this.$ = merge(this.getExternals(), ext);
  }

  execute(query, data, ext = {}) {
    this.setExternals(ext);
    return execute.call(this, query, data);
  }
}

export default new Xform();
