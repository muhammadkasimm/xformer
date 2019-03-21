'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const EXECUTE_QUERY = exports.EXECUTE_QUERY = 'EXECUTE_QUERY';
const PICK_BUFFER = exports.PICK_BUFFER = 'PICK_BUFFER';

const executeQuery = exports.executeQuery = result => {
  return {
    type: EXECUTE_QUERY,
    payload: result
  };
};