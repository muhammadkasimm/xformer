'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ramda = require('ramda');

var _executor = require('./executor');

class Xform {
  constructor() {
    this.$ = {};
  }

  setExternals(ext = {}) {
    this.$ = (0, _ramda.merge)(this.$, ext);
  }

  execute(query, data, ext = {}) {
    this.setExternals(ext);
    return _executor.execute.call(this, query, data);
  }
}

exports.default = new Xform();