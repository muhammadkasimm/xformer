"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.setContext = exports.getContext = void 0;

var _merge = _interopRequireDefault(require("ramda/src/merge"));

var _executor = require("./executor");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var context = {};

var getContext = function getContext() {
  return context;
};

exports.getContext = getContext;

var setContext = function setContext() {
  var ctx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  context = (0, _merge["default"])(getContext(), ctx);
};

exports.setContext = setContext;

function Xform() {
  setContext({});
  return {
    execute: function execute(query, data) {
      var ctx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var dispatch = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
      setContext(ctx);
      return (0, _executor.execute)(query, data, dispatch);
    },
    executePipe: function executePipe(pipe, data) {
      var ctx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      setContext(ctx);
      return (0, _executor.executePipe)(pipe, data);
    }
  };
}

var _default = Xform();

exports["default"] = _default;