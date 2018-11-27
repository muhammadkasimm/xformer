'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAverageForList = exports.getUsedMemoryForSingle = exports.isSomething = exports.isNothing = exports.logger = exports.getFirstMatch = exports.reduceIndexed = exports.mapIndexed = exports.zipValueWithStep = exports.sumList = exports.subtract = exports.sum = exports.typeMatches = exports.bePositive = exports.defaultToZero = exports.defaultTo = exports.isJunk = undefined;

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * @param  {number} input
 * @returns {number}
 */
const isJunk = exports.isJunk = R.pipe(parseFloat, R.anyPass([R.equals(NaN), R.equals(Infinity), R.equals(-Infinity)]));

/**
 * @param  {number} value
 * @param  {number} input
 * @returns {number}
 */
/*
  This file contains the smaller utilities and helpers that are used in the xFormer command pallete functions and parser.
*/

const defaultTo = exports.defaultTo = R.curry((value, input) => R.ifElse(isJunk, R.always(value), parseFloat)(input));

/**
 * @param  {number} input
 * @returns {number}
 */
const defaultToZero = exports.defaultToZero = defaultTo(0);

/**
 * @param  {number} input
 * @returns {number}
 */
const bePositive = exports.bePositive = R.pipe(defaultToZero, Math.abs);

// /**
//  * @param  {Object} input
//  * @returns {Object}
//  */
// export const xFormerForChart = R.evolve({
//   x: parseInt,
//   y: R.pipe(
//     defaultToZero,
//     bePositive
//   )
// });

/**
 * @param  {string} typeToBe
 * @param  {any} input
 * @returns {boolean}
 */
const typeMatches = exports.typeMatches = R.curry((typeToBe, input) => R.pipe(R.type, R.toLower, R.equals(R.toLower(typeToBe)))(input));

/**
 * @param  {number} left
 * @param  {number} right
 * @returns {Object}
 */
const sum = exports.sum = R.curry((left, right) => R.add(defaultToZero(left), defaultToZero(right)));

/**
 * @param  {number} left
 * @param  {number} right
 * @returns {Object}
 */
const subtract = exports.subtract = R.curry((left, right) => Math.abs(R.subtract(defaultToZero(left), defaultToZero(right))));

/**
 * @param  {Array<number>} data
 * @returns {number}
 */
const sumList = exports.sumList = R.reduce(sum, 0);

/**
 * @param  {string} step
 * @param  {any} data
 * @returns {Object}
 */
const zipValueWithStep = exports.zipValueWithStep = R.curry((step, data) => ({
  [step]: data
}));

/**
 * @param  {Function} fn(value, index)
 * @param  {Array<any>} data
 * @returns {Array<any>}
 */
const mapIndexed = exports.mapIndexed = R.addIndex(R.map);

/**
 * @param  {Function} fn
 * @param  {Array<any>} data
 * @returns {Array<any>}
 */
const reduceIndexed = exports.reduceIndexed = R.addIndex(R.reduce);

/**
 * @param  {string} regex
 * @param  {string} input
 * @returns {string}
 */
const getFirstMatch = exports.getFirstMatch = R.curry((regex, input) => R.pipe(R.match(new RegExp(regex)), R.pathOr('', [0]))(input));

/**
 * @param  {string} lbl
 * @param  {any} data
 * @returns {any}
 */
const logger = exports.logger = R.curry((lbl, data) => R.tap(x => console.log(`${lbl}:`, x), data));

/**
 * @param  {any} input
 * @returns {boolean}
 */
const isNothing = exports.isNothing = R.either(R.isEmpty, R.isNil);

/**
 * @param  {any} input
 * @returns {boolean}
 */
const isSomething = exports.isSomething = R.complement(isNothing);

/**
 * @param  {any} input
 * @returns {boolean}
 */
const getUsedMemoryForSingle = exports.getUsedMemoryForSingle = R.pipe(defaultTo(1), R.min(1), R.subtract(1), R.multiply(100));

/**
 * @param  {any} input
 * @returns {boolean}
 */
const getAverageForList = exports.getAverageForList = R.pipe(R.reject(isJunk), R.converge(R.divide, [R.sum, R.length]), defaultToZero);