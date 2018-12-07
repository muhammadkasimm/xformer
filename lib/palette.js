'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRate = exports.runAll = exports.getAvg = exports.getUsedMemory = exports.defaultAll = exports.sumAll = exports.differential = exports.mergeWithSubtract = exports.mergeWithAdd = exports.pickByRegex = exports.pickFrom = undefined;

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _executor = require('./executor');

var E = _interopRequireWildcard(_executor);

var _helpers = require('./helpers');

var _ = _interopRequireWildcard(_helpers);

var _decoder = require('./decoder');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Retrieves value at the specified path from a JSON object. '*' in the path is regarded as
 * a wildcard, meaning anything at this level will used to pick value from.
 *
 * @func
 * @param  {Array<string>} path
 * @param  {Object} input
 * @returns {any}
 * @example
 *      pickFrom(['a','b','c'], {'a': {'b': {'c': 20}}}) //=> 20
 *      pickFrom(['a','*','x'], {'a': {'b': {'x': 20}, 'c': {'x': 40}}}) //=> [20, 40]
 */
/*
  This file contains the xFormer functions; the end user will build queries using these functions.
	This is the command pallete.
*/

const pickFrom = exports.pickFrom = R.curry(_.pickFrom);

/**
 * Filters key-value pairs from a JSON object when key matches the specified regular expression (or string).
 *
 * @func
 * @param  {string} path
 * @param  {Object} input
 * @returns {Object}
 * @example
 *      pickByRegex('abc', {'abcd': {'b': {'c': 20}}, 'efg': {'h': {'i': 20}}) //=> {'b': {'c': 20}}
 */
const pickByRegex = exports.pickByRegex = R.curry((text, data) => R.ifElse(R.always(_.isNothing(text)), R.always({}), R.pickBy((v, k) => R.test(new RegExp(text), k)))(data));

/**
 * @param  {Function} xformer
 * @param  {Object|Array<Object>}  data
 * @returns {Object}
 */
const mergeWithOp = R.curry((xformer, data) => R.ifElse(_.typeMatches('array'), R.pipe(R.reject(_.isNothing), R.reduce(R.mergeWith(xformer), {})), R.pipe(R.pickBy(_.typeMatches('object')), R.values, R.reduce(R.mergeWith(xformer), {})))(data));

/**
 * Merges a list of JSON objects into a single JSON object by adding values having the same key; treats a non-number value as zero.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      mergeWithAdd([{ a: 1, b: 5 }, { a: 2 }, { a: 3 }]) //=> { a: 6, b: 5 }
 */
const mergeWithAdd = exports.mergeWithAdd = mergeWithOp(_.sum);

/**
 * Merges a list of JSON objects into a single JSON object by subtracting values having the same key; treats a non-number value as zero.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      mergeWithAdd([{ a: 1, b: 5 }, { a: 2 }, { a: 3 }]) //=> { a: 2, b: 5 }
 */
const mergeWithSubtract = exports.mergeWithSubtract = mergeWithOp(_.subtract);

/**
 * Applies iterative subtraction over consecutive values in a JSON object such that T[i] = T[i] - T[i-1]; first value is ignored in the result.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      differential({ a: 1, b: 2, c: 3 }) //=> { b: 1, c: 1 }
 */
const differential = exports.differential = R.curry(data => {
  const calculator = R.pipe(R.toPairs, R.reject(x => _.isJunk(x[1])), R.sortBy(R.prop(0)), R.aperture(2), R.map(([prev, next]) => [next[0], R.subtract(...R.pluck(1, [next, prev]))]), R.map(R.over(R.lensIndex(1), R.pipe(_.defaultToZero, _.bePositive))), R.fromPairs);

  return R.cond([[_.typeMatches('object'), calculator], [_.typeMatches('array'), R.pipe(calculator, R.values)]])(data);
});

/**
 * Recieves an array or object, adds all the values and return a single number. All non-number values
 * are treated as zero.
 *
 * @func
 * @param  {Object|Array} data
 * @returns {number}
 * @example
 *      sumAll([1, 2, 3]) //=> 6
 *      sumAll({a: 1, b: 2, c: 3}) //=> 6
 */
const sumAll = exports.sumAll = R.cond([[_.typeMatches('object'), R.pipe(R.values, _.sumList)], [_.typeMatches('array'), _.sumList], [_.typeMatches('number'), _.defaultToZero], [_.typeMatches('string'), _.defaultToZero], [R.T, R.always(0)]]);

/**
 * Recieves an array or object and replaces each junky value with the provided fallback value.
 * A value is considered junk if it can not be converted to a valid number. A stringy number
 * is converted to number.
 *
 * @param  {number} value
 * @param  {Object|Array} data
 * @returns {number}
 * @example
 *      defaultAll('N/A', [1, NaN, '3'])) //=> [1, 'N/A', 3]
 */
const defaultAll = exports.defaultAll = R.curry((value, data) => {
  return R.cond([[R.anyPass([_.typeMatches('array'), _.typeMatches('object')]), R.map(_.defaultTo(value))], [R.T, _.defaultTo(value)]])(data);
});

/**
 * Calculates percentages of used memory when given a list or JSON object containing percentages of free memory.
 *
 * @func
 * @param  {any} input
 * @returns {number}
 * @example
 *      getUsedMemory([0.1, 0.2, 0.3]) //=> [90, 80, 70]
 */
const getUsedMemory = exports.getUsedMemory = R.cond([[_.typeMatches('array'), R.map(_.getUsedMemoryForSingle)], [_.typeMatches('object'), R.map(_.getUsedMemoryForSingle)], [R.T, _.getUsedMemoryForSingle]]);

/**
 * Calculates average of values in a list or JSON object; ignores values that are not numbers.
 *
 * @func
 * @param  {any} input
 * @returns {number}
 * @example
 *      getAvg([1, 2, 3]) //=> 2
 */
const getAvg = exports.getAvg = R.cond([[_.typeMatches('array'), _.getAverageForList], [_.typeMatches('object'), R.pipe(R.values, _.getAverageForList)], [R.T, _.defaultToZero]]);

/**
 * Execute a list of pipelines on provided data. A pipeline is an array of action descriptions.
 * An action can be described in form of a string or JSON.
 *
 * @func
 * @param  {Array} pipes
 * @returns {Array}
 * @example
 *      runAll([
 *        ['pickFrom(["alpha"])', 'getAvg'], // pipe 1
 *        ['pickFrom(["beta"])', 'getAvg'],  // pipe 2
 *      ], {
 *        alpha: { a1: 1, a2: 2, a3: 3 },
 *        beta: { b1: 11, b2: 22, b3: 33 },
 *      })
 *
 *      => [2, 22]
 */
const runAll = exports.runAll = R.curry((pipes, data) => {
  return R.juxt(R.pipe(_decoder.decodePipe, R.map(R.apply(R.pipe)))(pipes))(data);
});

/**
 * @param  {Array} pipes
 * @returns {Array}
 * @example
 *       getRate(10, {'a': 20, 'b': 30}) // => {'a': 2, 'b': 3}
 */
const getRate = exports.getRate = R.curry((denominator, data) => {
  return R.cond([[R.anyPass([_.typeMatches('array'), _.typeMatches('object')]), R.map(_.divideBy(denominator))], [R.T, _.divideBy(denominator)]])(data);
});