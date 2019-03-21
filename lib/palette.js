'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMax = exports.isGreaterThanEqualTo = exports.isLessThanEqualTo = exports.isEqualTo = exports.isNothing = exports.takeTopPairsAndAddOthers = exports.takeTopAndCombineOthers = exports.cleanData = exports.sortDescending = exports.sortAscending = exports.map = exports.getRate = exports.runAll = exports.getAvg = exports.getUsedMemory = exports.defaultAll = exports.sumAll = exports.differential = exports.mergeAll = exports.mergeWithSubtract = exports.mergeWithAdd = exports.pickByRegex = exports.pickFrom = exports.makePair = undefined;

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var _executor = require('./executor');

var E = _interopRequireWildcard(_executor);

var _decoder = require('./decoder');

var D = _interopRequireWildcard(_decoder);

var _helpers = require('./helpers');

var _ = _interopRequireWildcard(_helpers);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * Returns `[x, y]`.
 *
 *
 * @param  {any} x
 * @param  {any} y
 * @returns {Array}
 * @example
 */
/*
  This file contains the xFormer functions; the end user will build queries using these functions.
	This is the command pallete.
*/

const makePair = exports.makePair = R.curry((x, y) => [x, y]);

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
const mergeWithOp = R.curry((xformer, data) => R.ifElse(_.typeMatches('array'), R.pipe(R.reject(_.isNothing), R.reduce(R.mergeDeepWith(xformer), {})), R.pipe(R.pickBy(_.typeMatches('object')), R.values, R.reduce(R.mergeDeepWith(xformer), {})))(data));

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
 * Merges a list of JSON objects into a single JSON object by subtracting values having the same key; treats a non-number value as zero.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      mergeWithAdd([{ a: 1, b: 5 }, { a: 2 }, { a: 3 }]) //=> { a: 2, b: 5 }
 */
const mergeAll = exports.mergeAll = mergeWithOp(_.keepLatest);

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
  return R.juxt(D.decodePipe(pipes))(data);
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

/**
 * Takes an action and data as input and returns the result of performing that action on each value in the data.
 *
 * @param  {Array} action
 * @param  {Array|Object} data
 * @returns {Array|Object}
 * @example
 *       map(['sumAll', 'getRate(100)'], [[2, 4], [4, 6]])
 */
const map = exports.map = R.curry((action, data) => {
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
 * @returns {data}
 * @example
 *       map(['sumAll', 'getRate(100)'], [[2, 4], [4, 6]])
 */
const _sort = R.curry((type, key, data) => {
  return R.cond([[_.typeMatches('array'), R.cond([[R.always(_.typeMatches('object', R.head(data))), R.sort(R[type](R.prop(key)))], [R.always(_.typeMatches('array', R.head(data))), R.sort(R[type](R.prop(key)))], [R.always(_.typeMatches('number', R.head(data))), R.sort(type === 'ascend' ? R.gt : R.lt)], [R.always(_.typeMatches('string', R.head(data))), R.sort(type === 'ascend' ? R.gt : R.lt)]])], [_.typeMatches('object'), R.pipe(R.toPairs, R.sort(R[type](R.prop(R.clamp(0, 1, _.defaultToZero(key))))))]])(data);
});

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
const sortAscending = exports.sortAscending = _sort('ascend');

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
const sortDescending = exports.sortDescending = _sort('descend');

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
const cleanData = exports.cleanData = R.curry((predicates, data) => {
  return R.cond([[_.typeMatches('array'), R.reject(R.anyPass(D.decodePipe(predicates)))], [_.typeMatches('object'), R.pickBy((v, k) => R.and(_.isSomething(k), R.complement(R.anyPass(D.decodePipe(predicates)))(v)))]])(data);
});

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
const takeTopAndCombineOthers = exports.takeTopAndCombineOthers = R.curry((x, xformer, data) => {
  return R.pipe(R.splitAt(x), ([topX, others]) => [...topX, D.decodeAction(xformer)(others)])(data);
});

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
const takeTopPairsAndAddOthers = exports.takeTopPairsAndAddOthers = takeTopAndCombineOthers(R.__, ['pickFrom(["*", 1])', 'sumAll', 'makePair("Others")'], R.__);

// PREDICATES
/**
 * Returns true if the value under test is empty or nil.
 *
 * @param  {any} value
 * @returns {boolean}
 * @example
 *        isNothing(undefined) //=> true
 *        isNothing(null) //=> true
 *        isNothing([]) //=> true
 *        isNothing({}) //=> true
 *        isNothing('') //=> true
 *        isNothing('Hello, world!') //=> false
 */
const isNothing = exports.isNothing = _.isNothing;

/**
 * Returns true if the 2 provided values are deeply equal.
 *
 * @param  {any} value
 * @returns {boolean}
 * @example
 *        isEqualTo('Batman', 'Bruce Wayne') //=> false
 *        isEqualTo([1], [1]) //=> true
 */
const isEqualTo = exports.isEqualTo = R.equals;

/**
 * Returns true if the second value is less than the first value.
 *
 * @param  {any} value
 * @returns {boolean}
 * @example
 *        isLessThanEqualTo(0, -2) //=> true
 *        isLessThanEqualTo(-4, -2) //=> false
 */
const isLessThanEqualTo = exports.isLessThanEqualTo = R.flip(R.lte);

/**
 * Returns true if the second value is greater than the first value.
 *
 * @param  {any} value
 * @returns {boolean}
 * @example
 *        isGreaterThanEqualTo(0, -2) //=> false
 *        isGreaterThanEqualTo(-4, -2) //=> true
 */
const isGreaterThanEqualTo = exports.isGreaterThanEqualTo = R.flip(R.gte);

/**
 * Find Max value.
 *
 * @param  {any} value
 * @returns {number}
 * @example
 *        getMax([1,2,3,4]) //=> 4
 *        getMax({a:1,b:2,c:3}) //=> 3
 */
const getMax = exports.getMax = R.cond([[_.typeMatches('array'), R.apply(Math.max)], [_.typeMatches('object'), R.pipe(R.values, R.apply(Math.max))], [R.T, R.identity]]);