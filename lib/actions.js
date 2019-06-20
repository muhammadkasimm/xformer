"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.executeQuery = exports.PICK_BUFFER = exports.EXECUTE_QUERY = void 0;
var EXECUTE_QUERY = 'EXECUTE_QUERY';
exports.EXECUTE_QUERY = EXECUTE_QUERY;
var PICK_BUFFER = 'PICK_BUFFER';
exports.PICK_BUFFER = PICK_BUFFER;

var executeQuery = function executeQuery(result) {
  return {
    type: EXECUTE_QUERY,
    payload: result
  };
};

exports.executeQuery = executeQuery;