'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _palette = require('./palette');

Object.keys(_palette).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _palette[key];
    }
  });
});

var _executor = require('./executor');

Object.keys(_executor).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _executor[key];
    }
  });
});