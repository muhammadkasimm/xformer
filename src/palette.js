/*
  This file contains the xFormer functions; the end user will build queries using these functions.
	This is the command pallete.
*/

import * as R from 'ramda';
import * as E from './executor';
import * as D from './decoder';
import * as H from './helpers';

/**
 * A special placeholder value used to specify "gaps" within functions, allowing partial application of any combination of arguments.
 *
 * @example
 *        fn(1, 2, 3)
 *        fn(_, 2, 3)(1)
 *        fn(1, _, 3)(2)
 *        fn(_, 2, _)(1, 3)
 *        fn(_, 2, _)(1)(3)
 */
export const _ = R.__;

/**
 * Returns true if the value under test is empty or nil.
 *
 * @param  {any} value
 * @returns {boolean}
 * @example
 *        isNothing(undefined) //=> true
 *        isNothing(null) //=> true
 *        isNothing([]) //=> true
 *        isNothing('') //=> true
 *        isNothing({}) //=> true
 *        isNothing('Hello, world!') //=> false
 */
export const isNothing = H.isNothing;

/**
 * Returns true if the 2 provided values are deeply equal.
 *
 * @param  {any} l
 * @param  {any} r
 * @returns {boolean}
 * @example
 *        isEqualTo('Batman', 'Bruce Wayne') //=> false
 *        isEqualTo([1], [1]) //=> true
 */
export const isEqualTo = R.memoizeWith((x, y) => R.toString([x, y]), R.equals);
/**
 * Returns booleon based upon provided regex.
 *
 * @param  {any} value
 * @returns {boolean}
 * @example
 *        testRegex('Batman', 'Bruce Wayne') //=> false
 *        testRegex(/Batman/i, 'batman Wayne') //=> true
 */
export const testRegex = R.curry((text, value) => R.test(new RegExp(text), value));

/**
 * Returns true if the second value is less than the first value.
 *
 * @param  {any} value
 * @returns {boolean}
 * @example
 *        isLessThanEqualTo(0, -2) //=> true
 *        isLessThanEqualTo(-4, -2) //=> false
 */
export const isLessThanEqualTo = R.flip(R.lte);

/**
 * Returns true if the second value is greater than the first value.
 *
 * @param  {any} value
 * @returns {boolean}
 * @example
 *        isGreaterThanEqualTo(0, -2) //=> false
 *        isGreaterThanEqualTo(-4, -2) //=> true
 */
export const isGreaterThanEqualTo = R.flip(R.gte);

/**
 * A function that returns the same value it was passed.
 */
export const identity = R.identity;

/**
 * @param  {number} left
 * @param  {number} right
 * @returns {number}
 * @example
 *         add(2, 2) //=> 4
 *         add(2, '2') //=> 4
 *         add(2, null) //=> 2
 *         add(undefined, null) //=> 0
 */
export const add = H.add;

/**
 * @param  {number} left
 * @param  {number} right
 * @returns {number}
 * @example
 *         subtract(4, 2) //=> 2
 *         subtract(4, '2') //=> 2
 *         subtract(4, null) //=> 4
 *         subtract(undefined, null) //=> 0
 */
export const subtract = H.subtract;

/**
 * @param  {number} left
 * @param  {number} right
 * @returns {number}
 * @example
 *         multiply(4, 2) //=> 8
 *         multiply(4, '2') //=> 8
 *         multiply(4, null) //=> 0
 *         multiply(undefined, null) //=> 0
 */
export const multiply = H.multiply;

/**
 * @param  {number} left
 * @param  {number} right
 * @returns {number}
 * @example
 *         divide(4, 2) //=> 2
 *         divide(4, '2') //=> 2
 *         divide(4, null) //=> 4
 *         divide(undefined, null) //=> 0
 */
export const divide = H.divide;

/**
 * @param  {number} left
 * @param  {number} right
 * @returns {number}
 * @example
 *         max(4, 2) //=> 4
 *         max(4, '2') //=> 4
 *         max(4, null) //=> 4
 *         max(undefined, null) //=> 0
 */
export const max = H.max;

/**
 * @param  {number} left
 * @param  {number} right
 * @returns {number}
 * @example
 *         min(4, 2) //=> 2
 *         min(4, '2') //=> 2
 *         min(4, null) //=> 0
 *         min(undefined, null) //=> 0
 */
export const min = H.min;

/**
 * @param  {number} v
 * @returns {number}
 * @example
 *         absolute(2) //=> 2
 *         absolute(-2) //=> 2
 */
export const absolute = R.curry(v => Math.abs(v));

/**
 * Returns `[x, y]`.
 *
 *
 * @param  {any} x
 * @param  {any} y
 * @returns {Array}
 * @example
 */
export const makePair = R.curry((x, y) => [x, y]);

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
export const pickFrom = R.memoizeWith((x, y) => R.toString([x, y]), R.curry(H.pickFrom));

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
export const pickByRegex = R.memoizeWith(
  (x, y) => R.toString([x, y]),
  R.curry((text, data) =>
    R.ifElse(
      R.always(isNothing(text)),
      R.always({}),
      R.pickBy((v, k) => R.test(new RegExp(text), k))
    )(data)
  )
);

/**
 * @param  {Function} xformer
 * @param  {Object|Array<Object>}  data
 * @returns {Object}
 */
export const mergeWithOp = R.memoizeWith(
  (x, y) => R.toString([x, y]),
  R.curry((xformer, data) =>
    R.ifElse(
      H.typeMatches('array'),
      R.pipe(
        R.reject(isNothing),
        R.reduce(R.mergeDeepWith(D.decodeAction(xformer)), {})
      ),
      R.pipe(
        R.pickBy(H.typeMatches('object')),
        R.values,
        R.reduce(R.mergeDeepWith(D.decodeAction(xformer)), {})
      )
    )(data)
  )
);

/**
 * Merges a list of JSON objects into a single JSON object by adding values having the same key; treats a non-number value as zero.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      mergeWithAdd([{ a: 1, b: 5 }, { a: 2 }, { a: 3 }]) //=> { a: 6, b: 5 }
 */
export const mergeWithAdd = mergeWithOp('add');

/**
 * Merges a list of JSON objects into a single JSON object by subtracting values having the same key; treats a non-number value as zero.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      mergeWithSubtract([{ a: 1, b: 5 }, { a: 2 }, { a: 3 }]) //=> { a: 2, b: 5 }
 */
export const mergeWithSubtract = mergeWithOp('subtract');

/**
 * Merges a list of JSON objects into a single JSON object by applying max to values having the same key; treats a non-number value as zero.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      mergeWithMax([{ a: 1, b: 5 }, { a: 2 }, { a: 3 }]) //=> { a: 3, b: 5 }
 */
export const mergeWithMax = mergeWithOp('max');

/**
 * Merges a list of JSON objects into a single JSON object by applying min to values having the same key; treats a non-number value as zero.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      mergeWithMin([{ a: 2, b: 5 }, { a: 1 }, { a: 3 }]) //=> { a: 1, b: 5 }
 */
export const mergeWithMin = mergeWithOp('min');

/**
 * Merges a list of JSON objects into a single JSON object by subtracting values having the same key; treats a non-number value as zero.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      mergeAll([{ a: 1, b: 5 }, { a: 2 }, { a: 3 }]) //=> { a: 2, b: 5 }
 */
export const mergeAll = mergeWithOp(H.keepLatest);

/**
 * Applies iterative subtraction over consecutive values in a JSON object such that T[i] = T[i] - T[i-1]; first value is ignored in the result.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      differential({ a: 1, b: 2, c: 3 }) //=> { b: 1, c: 1 }
 */
export const differential = R.memoizeWith(
  R.toString,
  R.curry(data => {
    const calculator = R.pipe(
      R.toPairs,
      R.reject(x => H.isJunk(x[1])),
      R.sortBy(R.prop(0)),
      R.aperture(2),
      R.map(([prev, next]) => [next[0], R.subtract(...R.pluck(1, [next, prev]))]),
      R.map(
        R.over(
          R.lensIndex(1),
          R.pipe(
            H.defaultToZero,
            H.bePositive
          )
        )
      ),
      R.fromPairs
    );

    return R.cond([
      [H.typeMatches('object'), calculator],
      [
        H.typeMatches('array'),
        R.pipe(
          calculator,
          R.values
        )
      ]
    ])(data);
  })
);

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
export const sumAll = R.memoizeWith(
  R.toString,
  R.cond([
    [
      H.typeMatches('object'),
      R.pipe(
        R.values,
        H.sumList
      )
    ],
    [H.typeMatches('array'), H.sumList],
    [H.typeMatches('number'), H.defaultToZero],
    [H.typeMatches('string'), H.defaultToZero],
    [R.T, R.always(0)]
  ])
);

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
export const defaultAll = R.curry((value, data) => {
  return R.cond([
    [R.anyPass([H.typeMatches('array'), H.typeMatches('object')]), R.map(H.defaultTo(value))],
    [R.T, H.defaultTo(value)]
  ])(data);
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
export const getUsedMemory = R.cond([
  [H.typeMatches('array'), R.map(H.getUsedMemoryForSingle)],
  [H.typeMatches('object'), R.map(H.getUsedMemoryForSingle)],
  [R.T, H.getUsedMemoryForSingle]
]);

/**
 * Calculates average of values in a list or JSON object; ignores values that are not numbers.
 *
 * @func
 * @param  {any} data
 * @returns {number}
 * @example
 *      getAvg([1, 2, 3]) //=> 2
 */
export const getAvg = R.memoizeWith(
  R.toString,
  R.cond([
    [H.typeMatches('array'), H.getAverageForList],
    [
      H.typeMatches('object'),
      R.pipe(
        R.values,
        H.getAverageForList
      )
    ],
    [R.T, H.defaultToZero]
  ])
);

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
export const runAll = R.memoizeWith(
  (x, y) => R.toString([x, y]),
  R.curry((pipes, data) => {
    return R.juxt(D.decodePipe(pipes))(data);
  })
);

/**
 * Divides values in a list or JSON object by the provided denominator.
 *
 * @param  {Array} pipes
 * @returns {Array}
 * @example
 *       getRate(10, {'a': 20, 'b': 30}) // => {'a': 2, 'b': 3}
 */
export const getRate = R.memoizeWith(
  (x, y) => R.toString([x, y]),
  R.curry((denominator, data) => {
    return R.cond([
      [
        R.anyPass([H.typeMatches('array'), H.typeMatches('object')]),
        R.map(H.divide(R.__, denominator))
      ],
      [R.T, H.divide(R.__, denominator)]
    ])(data);
  })
);

/**
 * Takes an action and data as input and returns the result of performing that action on each value in the data.
 *
 * @param  {Array} action
 * @param  {Array|Object} data
 * @returns {Array|Object}
 * @example
 *       map(['sumAll', 'getRate(100)'], [[2, 4], [4, 6]]) //=> [0.06, 0.1]
 */
export const map = R.curry((action, data) => {
  return R.map(D.decodeAction(action), data);
});

/**
 * Sort an Object or Array. Type can either be 'ascend' or 'descend'. When data is an array of
 * objects or arrays, key refers to the value with respect to which you want the data sorted. When data is an
 * object, key can either be `0` (sort by key) or `1` (sort by value); sorted object is returned as
 * a list of `[key, value]` pairs. When data is simply an array of numbers, key is ignored even if provided.
 *
 * @param  {string} type
 * @param  {string|number} key
 * @param  {any} data
 * @returns {_data}
 * @example
 *       map(['sumAll', 'getRate(100)'], [[2, 4], [4, 6]])
 */
const _sort = R.memoizeWith(
  (x, y, z) => R.toString([x, y, z]),
  R.curry((type, key, data) => {
    return R.cond([
      [
        H.typeMatches('array'),
        R.cond([
          [R.always(H.typeMatches('object', R.head(data))), R.sort(R[type](R.prop(key)))],
          [R.always(H.typeMatches('array', R.head(data))), R.sort(R[type](R.prop(key)))],
          [
            R.always(H.typeMatches('number', R.head(data))),
            R.sort(type === 'ascend' ? R.gt : R.lt)
          ],
          [R.always(H.typeMatches('string', R.head(data))), R.sort(type === 'ascend' ? R.gt : R.lt)]
        ])
      ],
      [
        H.typeMatches('object'),
        R.pipe(
          R.toPairs,
          R.sort(R[type](R.prop(R.clamp(0, 1, H.defaultToZero(key)))))
        )
      ]
    ])(data);
  })
);

/**
 * Sorts an array or object in ascending order. When data is an array of objects or arrays, key
 * refers to the value with respect to which you want the data sorted. When data is an object, key
 * can either be `0` (sort by key) or `1` (sort by value); sorted object is returned as a list
 * of `[key, value]` pairs. When data is simply an array of numbers, key is ignored even if provided.
 *
 * @param  {string|number} key
 * @returns {data}
 * @example
 *       sortAscending(null, [3, 2, 1]);    //=> [1, 2, 3]
 *       sortAscending(1, [[1, 345], [2, 45], [3, 121]]);    //=> [[2, 45], [3, 121], [1, 345]]
 *       sortAscending(0, { 'jkl': 345, 'efg': 121, 'uvx': 45 });    //=> [['efg', 121], ['jkl', 345], ['uvx', 45]]
 *       sortAscending(1, { 'jkl': 345, 'efg': 121, 'uvx': 45 });    //=> [['uvx', 45], ['efg', 121], ['jkl', 345]]
 */
export const sortAscending = _sort('ascend');

/**
 * Sorts an array or object in descending order. When data is an array of objects or arrays, key
 * refers to the value with respect to which you want the data sorted. When data is an object, key
 * can either be `0` (sort by key) or `1` (sort by value); sorted object is returned as a list
 * of `[key, value]` pairs. When data is simply an array of numbers, key is ignored even if provided.
 *
 * @param  {string|number} key
 * @returns {data}
 * @example
 *       sortDescending(null, [3, 2, 1]);    //=> [3, 2, 1]
 *       sortDescending(1, [[1, 345], [2, 45], [3, 121]]);    //=> [[1, 345], [3, 121], [2, 45]]
 *       sortDescending(0, { 'jkl': 345, 'efg': 121, 'uvx': 45 });    //=> [['uvx', 45], ['jkl', 345], ['efg', 121]]
 *       sortDescending(1, { 'jkl': 345, 'efg': 121, 'uvx': 45 });    //=> [['jkl', 345], ['efg', 121], ['uvx', 45]]
 */
export const sortDescending = _sort('descend');

/**
 * Removes values from an array or object by applying the provided predicate functions on
 * each value in an OR fashion. Additionally for an object, if a key is empty, it is removed
 * regardless of the value.
 *
 * @param  {Array} predicates
 * @param  {Array} data
 * @returns {Array}
 * @example
 *        cleanData(['isNothing'], [null, 1, 2, undefined, 3])
 *        //=> [1, 2, 3]
 */
export const cleanData = R.memoizeWith(
  (x, y) => R.toString([x, y]),
  R.curry((predicates, data) => {
    return R.cond([
      [H.typeMatches('array'), R.reject(R.anyPass(D.decodePipe(predicates)))],
      [
        H.typeMatches('object'),
        R.pickBy((v, k) =>
          R.and(H.isSomething(k), R.complement(R.anyPass(D.decodePipe(predicates)))(v))
        )
      ]
    ])(data);
  })
);

/**
 * Removes values from an array or object by applying provided predicate on keys or indices.
 *
 * @param  {Array} predicates
 * @param  {Object} data
 * @returns {Object}
 * @example
 *        cleanDataByKeys(['isNothing'], {'a':1,'b':2,'':3})
 *        //=> {a:1,b:2}
 */
export const cleanDataByKeys = R.memoizeWith(
  (x, y) => R.toString([x, y]),
  R.curry((predicates, data) => {
    return R.cond([
      [
        H.typeMatches('array'),
        R.pipe(
          R.pickBy((v, k) =>
            R.and(H.isSomething(k), R.complement(R.anyPass(D.decodePipe(predicates)))(k))
          ),
          R.values
        )
      ],
      [
        H.typeMatches('object'),
        R.pickBy((v, k) =>
          R.and(H.isSomething(k), R.complement(R.anyPass(D.decodePipe(predicates)))(k))
        )
      ]
    ])(data);
  })
);

/**
 * Takes top `x` items from a list and combines remaining by applying provided xformer.
 * Returns `[...topX, others]`.
 *
 * @param  {number} count
 * @param  {string|Object|Array} xformer
 * @param  {Array} data
 * @returns {Array}
 * @example
 *        takeTopAndCombineOthers(2, 'sumAll', [2, 3, 1, 2, 3])
 *        //=> [2, 3, 6]
 *
 */
export const takeTopAndCombineOthers = R.memoizeWith(
  (x, y, z) => R.toString([x, y, z]),
  R.curry((x, xformer, data) => {
    return R.pipe(
      R.splitAt(x),
      ([topX, others]) => [...topX, D.decodeAction(xformer)(others)]
    )(data);
  })
);

/**
 * Takes top `x` pairs from a list of pairs and combines remaining pairs by adding values
 * on index `1` of each pair; a pair should be of form `[x: any, y: number]`. Returns `[topX, others]`.
 *
 * @param  {number} count
 * @param  {string|Object|Array} xformer
 * @param  {Array} data
 * @returns {Array}
 * @example
 *        takeTopPairsAndAddOthers(2, [['abs', 2], ['fat', 3], ['net', 1], ['rip', 2], ['dom', 3]])
 *        //=> [['abs', 2], ['fat', 3], ['Others', 6]]
 */
export const takeTopPairsAndAddOthers = takeTopAndCombineOthers(
  R.__,
  ['pickFrom(["*", 1])', 'sumAll', 'makePair("Others")'],
  R.__
);

/**
 * Find Max value.
 *
 * @param  {any} value
 * @returns {number}
 * @example
 *        getMax([1, 2, 3, 4]) //=> 4
 *        getMax({ a: 1, b: 2, c: 3 }) //=> 3
 */
export const getMax = R.cond([
  [H.typeMatches('array'), R.apply(Math.max)],
  [
    H.typeMatches('object'),
    R.pipe(
      R.values,
      R.apply(Math.max)
    )
  ],
  [R.T, R.identity]
]);
