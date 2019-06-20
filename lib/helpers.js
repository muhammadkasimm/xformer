"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pickFrom = exports.pickProp = exports.getAverageForList = exports.getUsedMemoryForSingle = exports.isSomething = exports.isNothing = exports.logger = exports.getFirstMatch = exports.reduceIndexed = exports.mapIndexed = exports.zipValueWithStep = exports.sumList = exports.keepLatest = exports.min = exports.max = exports.divide = exports.multiply = exports.subtract = exports.add = exports.typeMatches = exports.bePositive = exports.defaultToZero = exports.defaultTo = exports.isJunk = void 0;

var R = _interopRequireWildcard(require("ramda"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @param  {number} input
 * @returns {number}
 */
var isJunk = R.pipe(parseFloat, R.anyPass([R.equals(NaN), R.equals(Infinity), R.equals(-Infinity)]));
/**
 * @param  {number} value
 * @param  {number} input
 * @returns {number}
 */

exports.isJunk = isJunk;
var defaultTo = R.curry(function (value, input) {
  return R.ifElse(isJunk, R.always(value), parseFloat)(input);
});
/**
 * @param  {number} input
 * @returns {number}
 */

exports.defaultTo = defaultTo;
var defaultToZero = defaultTo(0);
/**
 * @param  {number} input
 * @returns {number}
 */

exports.defaultToZero = defaultToZero;
var bePositive = R.pipe(defaultToZero, Math.abs);
/**
 * @param  {string} typeToBe
 * @param  {any} input
 * @returns {boolean}
 */

exports.bePositive = bePositive;
var typeMatches = R.curry(function (typeToBe, input) {
  return R.pipe(R.type, R.toLower, R.equals(R.toLower(typeToBe)))(input);
});
/**
 * @param  {number} l
 * @param  {number} r
 * @returns {number}
 */

exports.typeMatches = typeMatches;
var add = R.curry(function (l, r) {
  return R.add(defaultToZero(l), defaultToZero(r));
});
/**
 * @param  {number} l
 * @param  {number} r
 * @returns {number}
 */

exports.add = add;
var subtract = R.curry(function (l, r) {
  return R.subtract(defaultToZero(l), defaultToZero(r));
});
/**
 * @param  {number} l
 * @param  {number} r
 * @returns {number}
 */

exports.subtract = subtract;
var multiply = R.curry(function (l, r) {
  return R.multiply(defaultToZero(l), defaultToZero(r));
});
/**
 * @param  {number} l
 * @param  {number} r
 * @returns {number}
 */

exports.multiply = multiply;
var divide = R.curry(function (l, r) {
  return R.divide(defaultToZero(l), defaultTo(1, r));
});
/**
 * @param  {number} l
 * @param  {number} r
 * @returns {number}
 */

exports.divide = divide;
var max = R.curry(function (l, r) {
  return R.max(defaultToZero(l), defaultToZero(r));
});
/**
 * @param  {number} l
 * @param  {number} r
 * @returns {number}
 */

exports.max = max;
var min = R.curry(function (l, r) {
  return R.min(defaultToZero(l), defaultToZero(r));
});
/**
 * @param  {number} l
 * @param  {number} r
 * @returns {number}
 */

exports.min = min;
var keepLatest = R.curry(function (l, r) {
  return defaultToZero(r);
});
/**
 * @param  {Array<number>} data
 * @returns {number}
 */

exports.keepLatest = keepLatest;
var sumList = R.reduce(add, 0);
/**
 * @param  {string} step
 * @param  {any} data
 * @returns {Object}
 */

exports.sumList = sumList;
var zipValueWithStep = R.curry(function (step, data) {
  return _defineProperty({}, step, data);
});
/**
 * @param  {Function} fn(value, index)
 * @param  {Array<any>} data
 * @returns {Array<any>}
 */

exports.zipValueWithStep = zipValueWithStep;
var mapIndexed = R.addIndex(R.map);
/**
 * @param  {Function} fn
 * @param  {Array<any>} data
 * @returns {Array<any>}
 */

exports.mapIndexed = mapIndexed;
var reduceIndexed = R.addIndex(R.reduce);
/**
 * @param  {string} regex
 * @param  {string} input
 * @returns {string}
 */

exports.reduceIndexed = reduceIndexed;
var getFirstMatch = R.curry(function (regex, input) {
  return R.pipe(R.match(new RegExp(regex)), R.pathOr('', [0]))(input);
});
/**
 * @param  {string} lbl
 * @param  {any} data
 * @returns {any}
 */

exports.getFirstMatch = getFirstMatch;
var logger = R.curry(function (lbl, data) {
  return R.tap(function (x) {
    return console.log("".concat(lbl, ":"), x);
  }, data);
});
/**
 * @param  {any} input
 * @returns {boolean}
 */

exports.logger = logger;
var isNothing = R.either(R.isEmpty, R.isNil);
/**
 * @param  {any} input
 * @returns {boolean}
 */

exports.isNothing = isNothing;
var isSomething = R.complement(isNothing);
/**
 * @param  {any} input
 * @returns {boolean}
 */

exports.isSomething = isSomething;
var getUsedMemoryForSingle = R.pipe(defaultTo(1), R.min(1), R.subtract(1), R.multiply(100));
/**
 * @param  {any} input
 * @returns {boolean}
 */

exports.getUsedMemoryForSingle = getUsedMemoryForSingle;
var getAverageForList = R.pipe(R.reject(isJunk), R.converge(divide, [R.sum, R.length]), defaultToZero);
/**
 * @param  {string|number} prop
 * @param  {boolean} isPrevWildcard
 * @param  {Array|Object} data
 * @returns {any}
 */

exports.getAverageForList = getAverageForList;
var pickProp = R.curry(function (prop, isPrevWildcard, data) {
  return R.pipe(R.ifElse(R.always(R.equals('*', prop)), R.when(typeMatches('object'), R.values), //pickByWildcard
  R.ifElse(R.always(isPrevWildcard), R.pluck(prop), R.ifElse(R.pipe(R.prop(prop), isSomething), R.prop(prop), R.pluck(prop)))), R.when(typeMatches('array'), R.reject(R.isNil)))(data);
});
/**
 * @param  {number} idx
 * @param  {Array<string|number>} path
 * @param  {Array|Object} data
 * @returns  {any}
 */

exports.pickProp = pickProp;

function _pickFrom(idx, path, data) {
  if (R.gte(idx, R.length(path))) {
    return data;
  }

  var isPrevWildcard = R.equals('*', path[R.dec(idx)]);
  return _pickFrom(R.inc(idx), path, pickProp(R.nth(idx, path), isPrevWildcard, data));
}
/**
 * @param  {number} idx
 * @param  {Array<string|number>} path
 * @param  {Array|Object} data
 * @returns  {any}
 */


var pickFrom = R.curry(_pickFrom)(0);
exports.pickFrom = pickFrom;