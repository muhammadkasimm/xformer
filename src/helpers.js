/*
  This file contains the smaller utilities and helpers that are used in the xFormer command pallete functions and parser.
*/

import * as R from 'ramda';

/**
 * @param  {number} input
 * @returns {number}
 */
export const isJunk = R.pipe(
  parseFloat,
  R.anyPass([R.equals(NaN), R.equals(Infinity), R.equals(-Infinity)])
);

/**
 * @param  {number} value
 * @param  {number} input
 * @returns {number}
 */
export const defaultTo = R.curry((value, input) =>
  R.ifElse(isJunk, R.always(value), parseFloat)(input)
);

/**
 * @param  {number} input
 * @returns {number}
 */
export const defaultToZero = defaultTo(0);

/**
 * @param  {number} input
 * @returns {number}
 */
export const bePositive = R.pipe(
  defaultToZero,
  Math.abs
);

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
export const typeMatches = R.curry((typeToBe, input) =>
  R.pipe(
    R.type,
    R.toLower,
    R.equals(R.toLower(typeToBe))
  )(input)
);

/**
 * @param  {number} left
 * @param  {number} right
 * @returns {Object}
 */
export const sum = R.curry((left, right) => R.add(defaultToZero(left), defaultToZero(right)));

/**
 * @param  {Array<number>} data
 * @returns {number}
 */
export const sumList = R.reduce(sum, 0);

/**
 * @param  {string} step
 * @param  {any} data
 * @returns {Object}
 */
export const zipValueWithStep = R.curry((step, data) => ({
  [step]: data
}));

/**
 * @param  {Function} fn(value, index)
 * @param  {Array<any>} data
 * @returns {Array<any>}
 */
export const mapIndexed = R.addIndex(R.map);

/**
 * @param  {Function} fn
 * @param  {Array<any>} data
 * @returns {Array<any>}
 */
export const reduceIndexed = R.addIndex(R.reduce);

/**
 * @param  {string} regex
 * @param  {string} input
 * @returns {string}
 */
export const getFirstMatch = R.curry((regex, input) =>
  R.pipe(
    R.match(new RegExp(regex)),
    R.pathOr('', [0])
  )(input)
);

/**
 * @param  {string} lbl
 * @param  {any} data
 * @returns {any}
 */
export const logger = R.curry((lbl, data) => R.tap(x => console.log(`${lbl}:`, x), data));

/**
 * @param  {any} input
 * @returns {boolean}
 */
export const isNothing = R.either(R.isEmpty, R.isNil);

/**
 * @param  {any} input
 * @returns {boolean}
 */
export const isSomething = R.complement(isNothing);

/**
 * @param  {any} input
 * @returns {boolean}
 */
export const getUsedMemoryForSingle = R.pipe(
  defaultTo(1),
  R.min(1),
  R.subtract(1),
  R.multiply(100)
);
