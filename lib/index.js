"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  reducer: true
};
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _main["default"];
  }
});
Object.defineProperty(exports, "reducer", {
  enumerable: true,
  get: function get() {
    return _reducer["default"];
  }
});

var _main = _interopRequireDefault(require("./main"));

var _reducer = _interopRequireDefault(require("./reducer"));

var _palette = require("./palette");

Object.keys(_palette).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _palette[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }