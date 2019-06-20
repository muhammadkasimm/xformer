"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allPass = exports.anyPass = exports.all = exports.any = exports.getMax = exports.takeTopPairsAndAddOthers = exports.takeTopAndCombineOthers = exports.cleanDataByKeys = exports.cleanData = exports.sortObjectAscending = exports.sortObjectDescending = exports.sortDescending = exports.sortAscending = exports.map = exports.getRate = exports.runAll = exports.getAvg = exports.getUsedMemory = exports.defaultAll = exports.sumAll = exports.differential = exports.mergeAll = exports.mergeWithMin = exports.mergeWithMax = exports.mergeWithSubtract = exports.mergeWithAdd = exports.mergeWithOp = exports.pickByRegex = exports.pickFrom = exports.makePair = exports.absolute = exports.min = exports.max = exports.divide = exports.multiply = exports.subtract = exports.add = exports.identity = exports.isGreaterThanEqualTo = exports.isLessThanEqualTo = exports.isGreaterThan = exports.isLessThan = exports.testRegex = exports.isEqualTo = exports.isNothing = exports._ = void 0;

var R = _interopRequireWildcard(require("ramda"));

var E = _interopRequireWildcard(require("./executor"));

var D = _interopRequireWildcard(require("./decoder"));

var H = _interopRequireWildcard(require("./helpers"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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
var _ = R.__;
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

exports._ = _;
var isNothing = H.isNothing;
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

exports.isNothing = isNothing;
var isEqualTo = R.memoizeWith(function (x, y) {
  return R.toString([x, y]);
}, R.equals);
/**
 * Returns booleon based upon provided regex.
 *
 * @param  {any} value
 * @returns {boolean}
 * @example
 *        testRegex('Batman', 'Bruce Wayne') //=> false
 *        testRegex(/Batman/i, 'batman Wayne') //=> true
 */

exports.isEqualTo = isEqualTo;
var testRegex = R.curry(function (text, value) {
  return R.test(new RegExp(text), value);
});
/**
 * Returns true if the second value is less than the first value.
 *
 * @param  {any} value
 * @returns {boolean}
 * @example
 *        isLessThan(0, -2) //=> true
 *        isLessThan(-4, -2) //=> false
 */

exports.testRegex = testRegex;
var isLessThan = R.flip(R.lt);
/**
 * Returns true if the second value is greater than the first value.
 *
 * @param  {any} value
 * @returns {boolean}
 * @example
 *        isGreaterThan(0, -2) //=> false
 *        isGreaterThan(-4, -2) //=> true
 */

exports.isLessThan = isLessThan;
var isGreaterThan = R.flip(R.gt);
/**
 * Returns true if the second value is less than or equal to the first value.
 *
 * @param  {any} value
 * @returns {boolean}
 * @example
 *        isLessThanEqualTo(0, -2) //=> true
 *        isLessThanEqualTo(-4, -2) //=> false
 */

exports.isGreaterThan = isGreaterThan;
var isLessThanEqualTo = R.flip(R.lte);
/**
 * Returns true if the second value is greater than or equal to the first value.
 *
 * @param  {any} value
 * @returns {boolean}
 * @example
 *        isGreaterThanEqualTo(0, -2) //=> false
 *        isGreaterThanEqualTo(-4, -2) //=> true
 */

exports.isLessThanEqualTo = isLessThanEqualTo;
var isGreaterThanEqualTo = R.flip(R.gte);
/**
 * A function that returns the same value it was passed.
 */

exports.isGreaterThanEqualTo = isGreaterThanEqualTo;
var identity = R.identity;
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

exports.identity = identity;
var add = H.add;
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

exports.add = add;
var subtract = H.subtract;
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

exports.subtract = subtract;
var multiply = H.multiply;
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

exports.multiply = multiply;
var divide = H.divide;
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

exports.divide = divide;
var max = H.max;
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

exports.max = max;
var min = H.min;
/**
 * @param  {number} v
 * @returns {number}
 * @example
 *         absolute(2) //=> 2
 *         absolute(-2) //=> 2
 */

exports.min = min;
var absolute = R.curry(function (v) {
  return Math.abs(v);
});
/**
 * Returns `[x, y]`.
 *
 *
 * @param  {any} x
 * @param  {any} y
 * @returns {Array}
 * @example
 */

exports.absolute = absolute;
var makePair = R.curry(function (x, y) {
  return [x, y];
});
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

exports.makePair = makePair;
var pickFrom = R.memoizeWith(function (x, y) {
  return R.toString([x, y]);
}, R.curry(H.pickFrom));
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

exports.pickFrom = pickFrom;
var pickByRegex = R.memoizeWith(function (x, y) {
  return R.toString([x, y]);
}, R.curry(function (text, data) {
  return R.ifElse(R.always(isNothing(text)), R.always({}), R.pickBy(function (v, k) {
    return R.test(new RegExp(text), k);
  }))(data);
}));
/**
 * @param  {Function} xformer
 * @param  {Object|Array<Object>}  data
 * @returns {Object}
 */

exports.pickByRegex = pickByRegex;
var mergeWithOp = R.memoizeWith(function (x, y) {
  return R.toString([x, y]);
}, R.curry(function (xformer, data) {
  return R.ifElse(H.typeMatches('array'), R.pipe(R.reject(isNothing), R.reduce(R.mergeDeepWith(D.decodeAction(xformer)), {})), R.pipe(R.pickBy(H.typeMatches('object')), R.values, R.reduce(R.mergeDeepWith(D.decodeAction(xformer)), {})))(data);
}));
/**
 * Merges a list of JSON objects into a single JSON object by adding values having the same key; treats a non-number value as zero.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      mergeWithAdd([{ a: 1, b: 5 }, { a: 2 }, { a: 3 }]) //=> { a: 6, b: 5 }
 */

exports.mergeWithOp = mergeWithOp;
var mergeWithAdd = mergeWithOp('add');
/**
 * Merges a list of JSON objects into a single JSON object by subtracting values having the same key; treats a non-number value as zero.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      mergeWithSubtract([{ a: 1, b: 5 }, { a: 2 }, { a: 3 }]) //=> { a: 2, b: 5 }
 */

exports.mergeWithAdd = mergeWithAdd;
var mergeWithSubtract = mergeWithOp('subtract');
/**
 * Merges a list of JSON objects into a single JSON object by applying max to values having the same key; treats a non-number value as zero.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      mergeWithMax([{ a: 1, b: 5 }, { a: 2 }, { a: 3 }]) //=> { a: 3, b: 5 }
 */

exports.mergeWithSubtract = mergeWithSubtract;
var mergeWithMax = mergeWithOp('max');
/**
 * Merges a list of JSON objects into a single JSON object by applying min to values having the same key; treats a non-number value as zero.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      mergeWithMin([{ a: 2, b: 5 }, { a: 1 }, { a: 3 }]) //=> { a: 1, b: 5 }
 */

exports.mergeWithMax = mergeWithMax;
var mergeWithMin = mergeWithOp('min');
/**
 * Merges a list of JSON objects into a single JSON object by subtracting values having the same key; treats a non-number value as zero.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      mergeAll([{ a: 1, b: 5 }, { a: 2 }, { a: 3 }]) //=> { a: 2, b: 5 }
 */

exports.mergeWithMin = mergeWithMin;
var mergeAll = mergeWithOp(H.keepLatest);
/**
 * Applies iterative subtraction over consecutive values in a JSON object such that T[i] = T[i] - T[i-1]; first value is ignored in the result.
 *
 * @func
 * @param  {Array<Object>} data
 * @returns {Object}
 * @example
 *      differential({ a: 1, b: 2, c: 3 }) //=> { b: 1, c: 1 }
 */

exports.mergeAll = mergeAll;
var differential = R.memoizeWith(R.toString, R.curry(function (data) {
  var calculator = R.pipe(R.toPairs, R.reject(function (x) {
    return H.isJunk(x[1]);
  }), R.sortBy(R.prop(0)), R.aperture(2), R.map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        prev = _ref2[0],
        next = _ref2[1];

    return [next[0], R.subtract.apply(R, _toConsumableArray(R.pluck(1, [next, prev])))];
  }), R.map(R.over(R.lensIndex(1), R.pipe(H.defaultToZero, R.max(0)))), R.fromPairs);
  return R.cond([[H.typeMatches('object'), calculator], [H.typeMatches('array'), R.pipe(calculator, R.values)]])(data);
}));
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

exports.differential = differential;
var sumAll = R.memoizeWith(R.toString, R.cond([[H.typeMatches('object'), R.pipe(R.values, H.sumList)], [H.typeMatches('array'), H.sumList], [H.typeMatches('number'), H.defaultToZero], [H.typeMatches('string'), H.defaultToZero], [R.T, R.always(0)]]));
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

exports.sumAll = sumAll;
var defaultAll = R.curry(function (value, data) {
  return R.cond([[R.anyPass([H.typeMatches('array'), H.typeMatches('object')]), R.map(H.defaultTo(value))], [R.T, H.defaultTo(value)]])(data);
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

exports.defaultAll = defaultAll;
var getUsedMemory = R.cond([[H.typeMatches('array'), R.map(H.getUsedMemoryForSingle)], [H.typeMatches('object'), R.map(H.getUsedMemoryForSingle)], [R.T, H.getUsedMemoryForSingle]]);
/**
 * Calculates average of values in a list or JSON object; ignores values that are not numbers.
 *
 * @func
 * @param  {any} data
 * @returns {number}
 * @example
 *      getAvg([1, 2, 3]) //=> 2
 */

exports.getUsedMemory = getUsedMemory;
var getAvg = R.memoizeWith(R.toString, R.cond([[H.typeMatches('array'), H.getAverageForList], [H.typeMatches('object'), R.pipe(R.values, H.getAverageForList)], [R.T, H.defaultToZero]]));
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

exports.getAvg = getAvg;
var runAll = R.memoizeWith(function (x, y) {
  return R.toString([x, y]);
}, R.curry(function (pipes, data) {
  return R.juxt(D.decodePipe(pipes))(data);
}));
/**
 * Divides values in a list or JSON object by the provided denominator.
 *
 * @param  {Array} pipes
 * @returns {Array}
 * @example
 *       getRate(10, {'a': 20, 'b': 30}) // => {'a': 2, 'b': 3}
 */

exports.runAll = runAll;
var getRate = R.memoizeWith(function (x, y) {
  return R.toString([x, y]);
}, R.curry(function (denominator, data) {
  return R.cond([[R.anyPass([H.typeMatches('array'), H.typeMatches('object')]), R.map(H.divide(R.__, denominator))], [R.T, H.divide(R.__, denominator)]])(data);
}));
/**
 * Takes an action and data as input and returns the result of performing that action on each value in the data.
 *
 * @param  {Array} action
 * @param  {Array|Object} data
 * @returns {Array|Object}
 * @example
 *       map(['sumAll', 'getRate(100)'], [[2, 4], [4, 6]]) //=> [0.06, 0.1]
 */

exports.getRate = getRate;
var map = R.curry(function (action, data) {
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

exports.map = map;

var _sort = R.memoizeWith(function (x, y, z) {
  return R.toString([x, y, z]);
}, R.curry(function (type, key, data) {
  return R.cond([[H.typeMatches('array'), R.cond([[R.always(H.typeMatches('object', R.head(data))), R.sort(R[type](R.prop(key)))], [R.always(H.typeMatches('array', R.head(data))), R.sort(R[type](R.prop(key)))], [R.always(H.typeMatches('number', R.head(data))), R.sort(type === 'ascend' ? R.gt : R.lt)], [R.always(H.typeMatches('string', R.head(data))), R.sort(type === 'ascend' ? R.gt : R.lt)]])], [H.typeMatches('object'), R.pipe(R.toPairs, R.sort(R[type](R.prop(R.clamp(0, 1, H.defaultToZero(key))))))]])(data);
}));
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


var sortAscending = _sort('ascend');
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


exports.sortAscending = sortAscending;

var sortDescending = _sort('descend');
/**
 * Sorts an object in desccending order accordin to the provided action.
 *
 * @param  {string|number} key
 * @returns {data}
 * @example
 *        const data = {
 *          '192.168.0.48': { bytes_in_sum: 12606, bytes_out_sum: 8887 },
 *          '192.168.0.41': { bytes_in_sum: 14182, bytes_out_sum: 5818 },
 *          '192.168.0.54': { bytes_in_sum: 5068, bytes_out_sum: 12696 },
 *        }
 *        const sortedData = sortObjectDescending('pickFrom(["bytes_out_sum"])', data);
 *
 *        //=> [
 *          [ '192.168.0.54', { bytes_in_sum: 5068, bytes_out_sum: 12696 } ],
 *          [ '192.168.0.48', { bytes_in_sum: 12606, bytes_out_sum: 8887 } ],
 *          [ '192.168.0.41', { bytes_in_sum: 14182, bytes_out_sum: 5818 } ],
 *        ]
 */


exports.sortDescending = sortDescending;
var sortObjectDescending = R.memoizeWith(function () {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return R.toString(args);
}, R.curry(function (action, data) {
  return R.pipe(R.toPairs, R.sort(R.descend(function (x) {
    return D.decodeAction(action)(x[1]);
  })))(data);
}));
/**
 * Sorts an object in ascending order accordin to the provided action.
 *
 * @param  {string|number} key
 * @returns {data}
 *
 */

exports.sortObjectDescending = sortObjectDescending;
var sortObjectAscending = R.memoizeWith(function () {
  for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return R.toString(args);
}, R.curry(function (action, data) {
  return R.pipe(R.toPairs, R.sort(R.ascend(function (x) {
    return D.decodeAction(action)(x[1]);
  })))(data);
}));
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

exports.sortObjectAscending = sortObjectAscending;
var cleanData = R.memoizeWith(function (x, y) {
  return R.toString([x, y]);
}, R.curry(function (predicates, data) {
  return R.cond([[H.typeMatches('array'), R.reject(R.anyPass(D.decodePipe(predicates)))], [H.typeMatches('object'), R.pickBy(function (v, k) {
    return R.and(H.isSomething(k), R.complement(R.anyPass(D.decodePipe(predicates)))(v));
  })]])(data);
}));
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

exports.cleanData = cleanData;
var cleanDataByKeys = R.memoizeWith(function (x, y) {
  return R.toString([x, y]);
}, R.curry(function (predicates, data) {
  return R.cond([[H.typeMatches('array'), R.pipe(R.pickBy(function (v, k) {
    return R.and(H.isSomething(k), R.complement(R.anyPass(D.decodePipe(predicates)))(k));
  }), R.values)], [H.typeMatches('object'), R.pickBy(function (v, k) {
    return R.and(H.isSomething(k), R.complement(R.anyPass(D.decodePipe(predicates)))(k));
  })]])(data);
}));
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

exports.cleanDataByKeys = cleanDataByKeys;
var takeTopAndCombineOthers = R.memoizeWith(function (x, y, z) {
  return R.toString([x, y, z]);
}, R.curry(function (x, xformer, data) {
  return R.pipe(R.splitAt(x), function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        topX = _ref4[0],
        others = _ref4[1];

    return [].concat(_toConsumableArray(topX), [D.decodeAction(xformer)(others)]);
  })(data);
}));
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

exports.takeTopAndCombineOthers = takeTopAndCombineOthers;
var takeTopPairsAndAddOthers = takeTopAndCombineOthers(R.__, ['pickFrom(["*", 1])', 'sumAll', 'makePair("Others")'], R.__);
/**
 * Find max value.
 *
 * @param  {any} value
 * @returns {number}
 * @example
 *        getMax([1, 2, 3, 4]) //=> 4
 *        getMax({ a: 1, b: 2, c: 3 }) //=> 3
 */

exports.takeTopPairsAndAddOthers = takeTopPairsAndAddOthers;
var getMax = R.cond([[H.typeMatches('array'), R.apply(Math.max)], [H.typeMatches('object'), R.pipe(R.values, R.apply(Math.max))], [R.T, R.identity]]);
/**
 * Check if any value in array or object satisfies condition.
 *
 * @param  {Array} predicates
 * @param  {any} data
 * @returns {boolean}
 * @example
 *        any('isLessThanEqualTo(0)', {a: -1, b: 2, c: -1}) //=> true
 */

exports.getMax = getMax;
var any = R.memoizeWith(function (x, y) {
  return R.toString([x, y]);
}, R.curry(function (predicate, data) {
  return R.cond([[H.typeMatches('array'), R.any(D.decodeAction(predicate))], [H.typeMatches('object'), R.pipe(R.values, R.any(D.decodeAction(predicate)))], [R.T, D.decodeAction(predicate)]])(data);
}));
/**
 * Check if all values in array or object satisfy condition. Returns false if data is anything other than an array
 * or object.
 *
 * @param  {Array} predicates
 * @param  {any} data
 * @returns {boolean}
 * @example
 *        all('isLessThanEqualTo(0)', {a: -1, b: 2, c: -1}) //=> false
 */

exports.any = any;
var all = R.memoizeWith(function (x, y) {
  return R.toString([x, y]);
}, R.curry(function (predicate, data) {
  return R.cond([[H.typeMatches('array'), R.all(D.decodeAction(predicate))], [H.typeMatches('object'), R.pipe(R.values, R.all(D.decodeAction(predicate)))], [R.T, R.F]])(data);
}));
/**
 * Check if data passes any conditions.
 *
 * @param  {Array} predicates
 * @param  {any} data
 * @returns {boolean}
 * @example
 *        anyPass([['sum', 'isEqualTo(0)']], {a: -1, b: 2, c: -1})
 */

exports.all = all;
var anyPass = R.memoizeWith(function (x, y) {
  return R.toString([x, y]);
}, R.curry(function (predicates, data) {
  return R.anyPass(R.map(D.decodeAction, predicates))(data);
}));
/**
 * Check if data passes all conditions.
 *
 * @param  {Array} predicates
 * @param  {any} data
 * @returns {boolean}
 * @example
 *        allPass([['sum', 'isEqualTo(0)']], {a: -1, b: 2, c: -1})
 */

exports.anyPass = anyPass;
var allPass = R.memoizeWith(function (x, y) {
  return R.toString([x, y]);
}, R.curry(function (predicates, data) {
  return R.allPass(R.map(D.decodeAction, predicates))(data);
}));
exports.allPass = allPass;