/*
  This file contains the xFormer functions; the end user will build queries using these functions.
	This is the command pallete.
*/

import * as R from 'ramda';
import * as _ from './helpers';

/**
 * @param  {Array<string>} path
 * @param  {Object} input
 * @returns {any}
 */
export const pickFrom = R.pathOr({});

/**
 * @param  {string} path
 * @param  {Object} input
 * @returns {Object}
 */
export const pickByRegex = R.curry((text, data) =>
  R.ifElse(
    R.always(_.isNothing(text)),
    R.always({}),
    R.pickBy((v, k) => R.test(new RegExp(text), k))
  )(data)
);

/**
 * @param  {Function} xformer
 * @param  {Object|Array<Object>}  data
 * @returns {Object}
 */
const mergeWithOp = R.curry((xformer, data) =>
  R.ifElse(
    _.typeMatches('array'),
    R.pipe(
      R.reject(_.isNothing),
      R.reduce(R.mergeWith(xformer), {})
    ),
    R.pipe(
      R.pickBy(_.typeMatches('object')),
      R.values,
      R.reduce(R.mergeWith(xformer), {})
    )
  )(data)
);

/**
 * @param  {Array<Object>} data
 * @returns {Object}
 */
export const mergeWithAdd = mergeWithOp(_.sum);

/**
 * @param  {Object} data
 * @returns {Object}
 */
export const differential = R.curry(data => {
  const calculator = R.pipe(
    R.toPairs,
    R.reject(x => _.isJunk(x[1])),
    R.sortBy(R.prop(0)),
    R.aperture(2),
    R.map(([prev, next]) => [next[0], R.subtract(...R.pluck(1, [next, prev]))]),
    R.map(
      R.over(
        R.lensIndex(1),
        R.pipe(
          _.defaultToZero,
          _.bePositive
        )
      )
    ),
    R.fromPairs
  );

  return R.cond([
    [_.typeMatches('object'), calculator],
    [
      _.typeMatches('array'),
      R.pipe(
        calculator,
        R.values
      )
    ]
  ])(data);
});

// /**
//  * @param  {Object} data
//  * @returns {Array<Object>}
//  */
// export const getTimeSeries = R.pipe(
//   R.toPairs,
//   R.map(R.zipObj(['x', 'y'])),
//   R.map(_.xformForChart)
// );

/**
 * @param  {Object|Array} data
 * @returns {number}
 */
export const sumAll = R.cond([
  [
    _.typeMatches('object'),
    R.pipe(
      R.values,
      _.sumList
    )
  ],
  [_.typeMatches('array'), _.sumList],
  [_.typeMatches('number'), _.defaultToZero],
  [_.typeMatches('string'), _.defaultToZero],
  [R.T, R.always(0)]
]);
