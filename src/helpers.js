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
 * @param  {number} left
 * @param  {number} right
 * @returns {number}
 */
export const sum = R.curry((left, right) => R.add(defaultToZero(left), defaultToZero(right)));

/**
 * @param  {number} left
 * @param  {number} right
 * @returns {number}
 */
export const subtract = R.curry((left, right) =>
  Math.abs(R.subtract(defaultToZero(left), defaultToZero(right)))
);

/**
 * @param  {number} left
 * @param  {number} right
 * @returns {number}
 */
export const keepLatest = R.curry((left, right) => defaultToZero(right));

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

/**
 * @param  {any} input
 * @returns {boolean}
 */
export const getAverageForList = R.pipe(
  R.reject(isJunk),
  R.converge(R.divide, [R.sum, R.length]),
  defaultToZero
);

/**
 * @param  {any} input
 * @returns {boolean}
 */
export const divideBy = R.curry((denominator, numerator) => {
  return R.pipe(
    defaultTo(1),
    R.divide(defaultToZero(numerator))
  )(denominator);
});

/**
 * @param  {string} prop
 * @param  {Object|Array} data
 * @returns {any}
 */
export const pickProp = R.curry((prop, data) =>
  R.ifElse(
    R.always(R.equals('*', prop)),
    R.cond([
      [typeMatches('object'), R.values],
      [
        typeMatches('array'),
        R.pipe(
          R.flatten,
          R.map(R.values)
        )
      ]
    ]),
    R.cond([
      [typeMatches('object'), R.prop(prop)],
      [
        typeMatches('array'),
        R.pipe(
          R.flatten,
          mapIndexed((x, i) =>
            R.ifElse(
              R.always(
                R.pipe(
                  parseInt,
                  R.equals(i)
                )(prop)
              ),
              R.identity,
              R.prop(prop)
            )(x)
          ),
          R.reject(isNothing)
        )
      ]
    ])
  )(data)
);

/**
 * @param  {Array<string>} path
 * @param  {Object|Array} data
 * @returns {any}
 */
export function pickFrom(path, data) {
  if (R.isEmpty(path)) {
    return R.when(
      R.allPass([
        typeMatches('array'),
        R.pipe(
          R.length,
          R.equals(1)
        )
      ]),
      R.head
    )(data);
  }

  return pickFrom(R.tail(path), pickProp(R.head(path), data));
}

/**
 * @param  {Array<string>} path
 * @param  {Object|Array} data
 * @returns {any}
 */
export function isDataRejectable(value, key) {
  if (typeof key === 'undefined') {
    // Array item
    return R.anyPass([isNothing, isJunk])(value);
  } else {
    // Object item
  }
}
