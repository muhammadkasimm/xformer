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
 * @param  {Array<string>} path
 * @param  {Object} input
 * @returns {any}
 */
/*
  This file contains the xFormer functions; the end user will build queries using these functions.
	This is the command pallete.
*/

const pickFrom = exports.pickFrom = R.pathOr({});

/**
 * @param  {string} path
 * @param  {Object} input
 * @returns {Object}
 */
const pickByRegex = exports.pickByRegex = R.curry((text, data) => R.ifElse(R.always(_.isNothing(text)), R.always({}), R.pickBy((v, k) => R.test(new RegExp(text), k)))(data));

/**
 * @param  {Function} xformer
 * @param  {Object|Array<Object>}  data
 * @returns {Object}
 */
const mergeWithOp = R.curry((xformer, data) => R.ifElse(_.typeMatches('array'), R.pipe(R.reject(_.isNothing), R.reduce(R.mergeWith(xformer), {})), R.pipe(R.pickBy(_.typeMatches('object')), R.values, R.reduce(R.mergeWith(xformer), {})))(data));

/**
 * @param  {Array<Object>} data
 * @returns {Object}
 */
const mergeWithAdd = exports.mergeWithAdd = mergeWithOp(_.sum);

/**
 * @param  {Array<Object>} data
 * @returns {Object}
 */
const mergeWithSubtract = exports.mergeWithSubtract = mergeWithOp(_.subtract);

/**
 * @param  {Object} data
 * @returns {Object}
 */
const differential = exports.differential = R.curry(data => {
  const calculator = R.pipe(R.toPairs, R.reject(x => _.isJunk(x[1])), R.sortBy(R.prop(0)), R.aperture(2), R.map(([prev, next]) => [next[0], R.subtract(...R.pluck(1, [next, prev]))]), R.map(R.over(R.lensIndex(1), R.pipe(_.defaultToZero, _.bePositive))), R.fromPairs);

  return R.cond([[_.typeMatches('object'), calculator], [_.typeMatches('array'), R.pipe(calculator, R.values)]])(data);
});

/**
 * @param  {Object|Array} data
 * @returns {number}
 */
const sumAll = exports.sumAll = R.cond([[_.typeMatches('object'), R.pipe(R.values, _.sumList)], [_.typeMatches('array'), _.sumList], [_.typeMatches('number'), _.defaultToZero], [_.typeMatches('string'), _.defaultToZero], [R.T, R.always(0)]]);

/**
 * @param  {number} value
 * @param  {Object|Array} data
 * @returns {number}
 */
const defaultAll = exports.defaultAll = R.curry((value, data) => {
  R.cond([[R.anyPass([_.typeMatches('array'), _.typeMatches('object')]), R.map(_.defaultTo(value))], [R.T, _.defaultTo(value)]])(data);
});

/**
 * @param  {any} input
 * @returns {number}
 */
const getUsedMemory = exports.getUsedMemory = R.cond([[_.typeMatches('array'), R.map(_.getUsedMemoryForSingle)], [_.typeMatches('object'), R.map(_.getUsedMemoryForSingle)], [R.T, _.getUsedMemoryForSingle]]);

/**
 * @param  {any} input
 * @returns {number}
 */
const getAvg = exports.getAvg = R.cond([[_.typeMatches('array'), _.getAverageForList], [_.typeMatches('object'), R.pipe(R.values, _.getAverageForList)], [R.T, _.defaultToZero]]);

/**
 * @param  {Array} pipes
 * @returns {Array}
 */
const runAll = exports.runAll = R.curry((pipes, data) => {
  return R.juxt(R.pipe(_decoder.decodePipe, R.map(R.apply(R.pipe)))(pipes))(data);
});

/**
 * @param  {Array} pipes
 * @returns {Array}
 */
const getRate = exports.getRate = R.curry((denominator, data) => {
  return R.cond([[R.anyPass([_.typeMatches('array'), _.typeMatches('object')]), R.map(_.divideBy(denominator))], [R.T, _.divideBy(denominator)]])(data);
});