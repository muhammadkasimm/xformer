import { merge } from 'ramda';
import { execute } from './executor';

class Xform {
  constructor() {
    this.$ = {};
  }

  setExternals(ext = {}) {
    this.$ = merge(this.$, ext);
  }

  execute(query, data, ext = {}) {
    this.setExternals(ext);
    return execute.call(this, query, data);
  }
}

export default new Xform();
