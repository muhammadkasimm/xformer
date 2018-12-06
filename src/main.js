import merge from 'ramda/src/merge';
import { execute, executePipe } from './executor';

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

  executePipe(pipe, data, ext = {}) {
    this.setExternals(ext);
    return executePipe.call(this, pipe, data);
  }
}

export default new Xform();
