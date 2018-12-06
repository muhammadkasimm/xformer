'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _merge = require('ramda/src/merge');

var _merge2 = _interopRequireDefault(_merge);

var _executor = require('./executor');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Xform {
  constructor() {
    this.$ = {};
  }

  getExternals() {
    return this.$;
  }

  setExternals(ext = {}) {
    this.$ = (0, _merge2.default)(this.getExternals(), ext);
  }

  execute(query, data, ext = {}) {
    this.setExternals(ext);
    return _executor.execute.call(this, query, data);
  }

  executePipe(pipe, data, ext = {}) {
    this.setExternals(ext);
    return _executor.executePipe.call(this, pipe, data);
  }
}

exports.default = new Xform();