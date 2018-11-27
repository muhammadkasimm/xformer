'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parser = undefined;

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _palette = require('./palette');

var E = _interopRequireWildcard(_palette);

var _helpers = require('./helpers');

var _ = _interopRequireWildcard(_helpers);

var _palleteRequirements = require('./palleteRequirements');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/*
  Author: Muhammad Kasim
  This file contains the parsing logic for XFormer queries.
*/

const ALIAS_REGEX = /^[a-zA-z0-9_]*/;
const OPENING_PARAN_REGEX = /^[\(]?/;
const CLOSING_PARAN_REGEX = /[\)]?$/;
const SEPARATOR_REGEX = /[,][ ]?/;

/**
 * @param  {string} action
 * @returns {Function}
 *
 * Takes a string representation of a function from the command pallete. It then picks the function name and the provided
 * params from this string and returns the function with the evaluated params. If no matching function is found, R.identity
 * is returned in its place.
 */
function decodeStringyAction(action) {
  return R.pipe(R.juxt([_.getFirstMatch(ALIAS_REGEX), R.pipe(R.replace(ALIAS_REGEX, ''), R.replace(OPENING_PARAN_REGEX, ''), R.replace(CLOSING_PARAN_REGEX, ''), R.split(SEPARATOR_REGEX), R.without(['', undefined]), R.map(eval))]), R.ifElse(R.pipe(R.prop(0), R.has(R.__, E)), R.ifElse(R.pipe(R.prop(1), _.isSomething), ([a, p]) => E[a](...p), ([a, p]) => E[a]), R.identity))(action);
}

/**
 * @param  {Object} action
 * @returns {Function}
 *
 * Takes a JSON representation of a function from the command pallete and returns the function with the evaluated params. If no matching function is found, R.identity
 * is returned in its place.
 */
function decodeObjectAction(action) {
  const { name, params, func } = action;

  if (R.has(name, E)) {
    let _func = [];
    let _params = [];

    if (_.typeMatches('array', func) && _.isSomething(func)) _func = decodePipe(func);
    if (_.isSomething(params)) _params = _.typeMatches('array', params) ? params : [params];
    if (_.isSomething(_func)) return E[name](R.pipe(..._func), ..._params);
    return E[name](..._params);
  } else {
    return R.identity;
  }
}

/**
 * @param  {Array<string>} pipe
 * @returns {Array<Function>}
 *
 * Takes a string or Object representation of an action and decodes it into the matching function from command pallete; if no
 * matching function is found, R.identity is put in its place. R.identity is a function that returns the value
 * it was called with. Command pallete is located in src/XFormer/xformerFns.
 */
const _decodePipe = R.cond([[_.typeMatches('string'), decodeStringyAction], [_.typeMatches('object'), decodeObjectAction]]);

/**
 * @param  {Array<string>} pipe
 * @returns {Array<Function>}
 *
 * Takes an array of strings and replaces each string with the matching function from the command pallete; if no
 * matching function is found, R.identity is put in its place. R.identity is a function that returns the value
 * it was called with. Command pallete is located in src/XFormer/xformerFns.
 */
const decodePipe = R.map(R.cond([[_.typeMatches('string'), _decodePipe], [_.typeMatches('object'), _decodePipe], [_.typeMatches('array'), R.map(_decodePipe)]]));

/**
 * @param  {string | Object} action
 * @returns {string} name of the action
 *
 * Takes a string or Object representation of an action and returns the name of the action.
 */
const getActionName = R.curry((action, idx) => {
  return R.cond([[_.typeMatches('string'), _.getFirstMatch(ALIAS_REGEX)], [_.typeMatches('object'), R.prop('name')], [_.typeMatches('array'), R.always(`combo_${idx}`)]])(action);
});

/**
 * @param  {string | Object | Array<string|Object>} fn
 * @param  {Object} info
 * @param  {Object} acc
 * @returns {Object}
 *
 * Takes an action or list of actions, current state of accumulator and updates the accumulator
 * according to the action(s).
 */
const executeAction = R.curry((fn, data) => {
  return R.cond([[_.typeMatches('function'), R.applyTo(data)], [_.typeMatches('array'), R.converge(R.call, [R.juxt, R.always(data)])]])(fn);
});

/**
 * @param  {string | Object | Array<string|Object>} fn
 * @param  {Object} info
 * @param  {Object} acc
 * @returns {Object}
 *
 * Takes an action or list of actions, current state of accumulator and updates the accumulator
 * according to the action(s).
 */
const updateAccumulator = R.curry((fn, info, acc) => {
  return R.pipe(R.over(R.lensProp('buffer'), R.append({ title: info.name, data: executeAction(fn, acc.result) })), R.set(R.lensProp('result'), executeAction(fn, acc.result)))(acc);
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
const executePipe = R.curry((data, pipe) => {
  return R.pipe(decodePipe, _.reduceIndexed((acc, fn, idx) => {
    const info = { idx: idx, name: getActionName(R.nth(idx, pipe), idx) };
    return updateAccumulator(fn, info, acc);
  }, {
    buffer: [],
    result: data
  }))(pipe);
});

/**
 * @param  {Object} query
 * @param  {Object} data
 * @returns {Object}
 *
 * Takes a query and data as input and executes all pipelines within the query, with each pipeline receiving the
 * provided data.
 */
const parser = exports.parser = R.curry((query, data) => R.map(executePipe(data), query));