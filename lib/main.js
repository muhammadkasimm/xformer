'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setContext = exports.getContext = undefined;

var _merge = require('ramda/src/merge');

var _merge2 = _interopRequireDefault(_merge);

var _executor = require('./executor');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let context = {};
const getContext = exports.getContext = () => context;
const setContext = exports.setContext = (ctx = {}) => {
  context = (0, _merge2.default)(getContext(), ctx);
};

function Xform() {
  setContext({});

  return {
    execute: (query, data, ctx = {}, dispatch = undefined) => {
      setContext(ctx);
      return (0, _executor.execute)(query, data, dispatch);
    },
    executePipe: (pipe, data, ctx = {}) => {
      setContext(ctx);
      return (0, _executor.executePipe)(pipe, data);
    }
  };
}

exports.default = Xform();