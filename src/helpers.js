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
 * @param  {number} l
 * @param  {number} r
 * @returns {number}
 */
export const add = R.curry((l, r) => R.add(defaultToZero(l), defaultToZero(r)));

/**
 * @param  {number} l
 * @param  {number} r
 * @returns {number}
 */
export const subtract = R.curry((l, r) => R.subtract(defaultToZero(l), defaultToZero(r)));

/**
 * @param  {number} l
 * @param  {number} r
 * @returns {number}
 */
export const multiply = R.curry((l, r) => R.multiply(defaultToZero(l), defaultToZero(r)));

/**
 * @param  {number} l
 * @param  {number} r
 * @returns {number}
 */
export const divide = R.curry((l, r) => R.divide(defaultToZero(l), defaultTo(1, r)));

/**
 * @param  {number} l
 * @param  {number} r
 * @returns {number}
 */
export const max = R.curry((l, r) => R.max(defaultToZero(l), defaultToZero(r)));

/**
 * @param  {number} l
 * @param  {number} r
 * @returns {number}
 */
export const min = R.curry((l, r) => R.min(defaultToZero(l), defaultToZero(r)));

/**
 * @param  {number} l
 * @param  {number} r
 * @returns {number}
 */
export const keepLatest = R.curry((l, r) => defaultToZero(r));

/**
 * @param  {Array<number>} data
 * @returns {number}
 */
export const sumList = R.reduce(add, 0);

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

/**
 * @param  {any} input
 * @returns {boolean}
 */
export const getAverageForList = R.pipe(
  R.reject(isJunk),
  R.converge(divide, [R.sum, R.length]),
  defaultToZero
);

/**
 * @param  {string|number} prop
 * @param  {boolean} isPrevWildcard
 * @param  {Array|Object} data
 * @returns {any}
 */
export const pickProp = R.curry((prop, isPrevWildcard, data) => {
  return R.pipe(
    R.ifElse(
      R.always(R.equals('*', prop)),
      R.when(typeMatches('object'), R.values), //pickByWildcard
      R.ifElse(
        R.always(isPrevWildcard),
        R.pluck(prop),
        R.ifElse(
          R.pipe(
            R.prop(prop),
            isSomething
          ),
          R.prop(prop),
          R.pluck(prop)
        )
      )
    ),
    R.when(typeMatches('array'), R.reject(R.isNil))
  )(data);
});

/**
 * @param  {number} idx
 * @param  {Array<string|number>} path
 * @param  {Array|Object} data
 * @returns  {any}
 */
function _pickFrom(idx, path, data) {
  if (R.gte(idx, R.length(path))) {
    return data;
  }

  const isPrevWildcard = R.equals('*', path[R.dec(idx)]);
  return _pickFrom(R.inc(idx), path, pickProp(R.nth(idx, path), isPrevWildcard, data));
}

/**
 * @param  {number} idx
 * @param  {Array<string|number>} path
 * @param  {Array|Object} data
 * @returns  {any}
 */
export const pickFrom = R.curry(_pickFrom)(0);
