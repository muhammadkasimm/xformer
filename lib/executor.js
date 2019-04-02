'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = exports.executePipe = undefined;

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _decoder = require('./decoder');

var D = _interopRequireWildcard(_decoder);

var _helpers = require('./helpers');

var H = _interopRequireWildcard(_helpers);

var _actions = require('./actions');

var _constants = require('./constants');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * @param  {Function | Array<Function>} fn
 * @param  {Object} data
 * @returns {Object}
 *
 * Takes an action or list of actions, current state of accumulator and updates the accumulator
 * according to the action(s).
 */
const executeAction = R.curry((fn, data) => {
  return R.cond([[H.typeMatches('function'), R.applyTo(data)], [H.typeMatches('array'), R.map(R.applyTo(data))]])(fn);
});

/**
 * @param  {Function | Array<Function>} fn
 * @param  {Object} info
 * @param  {Object} acc
 * @returns {Object}
 *
 * Takes an action or list of actions, current state of accumulator and updates the accumulator
 * according to the action(s).
 */
const updateAccumulator = R.curry((fn, info, acc) => {
  const executedData = executeAction(fn, acc.result);

  return R.pipe(R.over(R.lensProp('buffer'), R.append({
    title: info.name,
    data: executedData,
    info: info.info
  })), R.set(R.lensProp('result'), executedData))(acc);
});

/**
 * @param  {Array<string>} pipe
 * @param  {any} data
 * @returns {any}
 *
 * Takes a pipeline and data as input and performs two actions upon it.
 * 1. Decodes string and Object representations into functions from the command pallete.
 * 2. Executes the functions in a pipeline fashion while keeping track of the output of each step.
 *
 * Returns an object containing the result of executing the pipeline and the corresponding result of each step.
 */
const executePipe = exports.executePipe = R.curry((pipe, data) => {
  return R.pipe(D.decodePipe, H.reduceIndexed((acc, fn, idx) => {
    const info = {
      idx: idx,
      name: D.getActionName(R.nth(idx, pipe), idx),
      info: D.getActionInfo(R.nth(idx, pipe), idx)
    };
    try {
      return updateAccumulator(fn, info, acc);
    } catch (error) {
      console.error(error.stack);
      console.error('Failed to perform action:', {
        name: info.name,
        data: acc
      });
    }
  }, {
    buffer: [],
    result: data
  }), R.over(R.lensProp('buffer'), R.insert(0, { title: 'Original Data', data: data })))(pipe);
});

/**
 * @param  {Object} query
 * @param  {Object} data
 * @returns {Object}
 *
 * Takes a query and data as input and executes all pipelines within the query, with each pipeline receiving the
 * provided data.
 */
const execute = exports.execute = R.curry((query, data, dispatch) => {
  const result = R.map(executePipe(R.__, data), query);
  if (dispatch) dispatch((0, _actions.executeQuery)(result));
  return result;
});