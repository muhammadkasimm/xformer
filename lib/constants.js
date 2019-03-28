'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
const ALIAS_REGEX = (exports.ALIAS_REGEX = /^[a-zA-z0-9_]*/);
const OPENING_PARAN_REGEX = (exports.OPENING_PARAN_REGEX = /^[\(]?/);
const CLOSING_PARAN_REGEX = (exports.CLOSING_PARAN_REGEX = /[\)]?$/);
const SEPARATOR_REGEX = (exports.SEPARATOR_REGEX = /[,][ ]?/);

const PALETTE_INFO = (exports.PALETTE_INFO = {
  makePair: 'Takes a key-value pair and returns a pair of form [key, value].',
  pickFrom:
    'Retrieves value at the specified path from a JSON object. "*" in the path is regarded as a wildcard, meaning anything at this level will used to pick value from.',
  pickByRegex:
    'Filters key-value pairs from a JSON object when key matches the specified regular expression (or string).',
  mergeWithAdd:
    'Merges a list of JSON objects into a single JSON object by adding values having the same key; treats a non-number value as zero.',
  mergeWithSubtract:
    'Merges a list of JSON objects into a single JSON object by subtracting values having the same key; treats a non-number value as zero.',
  mergeAll:
    'Merges a list of JSON objects into a single JSON object. If a key exists in both objects, the value from the second object will be used.',
  differential:
    'Applies iterative subtraction over consecutive values in a JSON object such that T[i] = T[i] - T[i-1]; first value is ignored in the result.',
  sumAll: 'Sums up all values in a list or JSON object; ignores values that are not numbers.',
  defaultAll: 'Replaces non-number values in a list or JSON object with the specified value.',
  getUsedMemory:
    'Calculates percentages of used memory when given a list or JSON object containing percentages of free memory.',
  getAvg:
    'Calculates average of values in a list or JSON object; ignores values that are not numbers.',
  getRate:
    'Calculates rate by dividing each value in a list or JSON object by the provided interval; ignores values that are not numbers.',
  runAll: 'Execute a list of pipelines on provided data.',
  map:
    'Takes an action and data as input and returns the result of performing that action on each value in the data.',
  sortAscending:
    'Sorts an array or object in ascending order. When data is an array of objects or arrays, key refers to the value with respect to which you want the data sorted. When data is an object, key can either be `0` (sort by key) or `1` (sort by value); sorted object is returned as a list of `[key, value]` pairs. When data is simply an array of numbers, key is ignored even if provided.',
  sortDescending:
    'Sorts an array or object in descending order. When data is an array of objects or arrays, key refers to the value with respect to which you want the data sorted. When data is an object, key can either be `0` (sort by key) or `1` (sort by value); sorted object is returned as a list of `[key, value]` pairs. When data is simply an array of numbers, key is ignored even if provided.',
  cleanData:
    'Removes values from an array or object by applying the provided predicate functions on each value in an OR fashion. Additionally for an object, if a key is empty, it is removed regardless of the value.',
  takeTopAndCombineOthers:
    'Takes top `x` items from a list and combines remaining by applying provided xformer. Returns `[...topX, others]`.',
  takeTopPairsAndAddOthers:
    'Takes top `x` pairs from a list of pairs and combines remaining pairs by adding values on index `1` of each pair; a pair should be of form `[x: any, y: number]`. Returns `[topX, others]`.',
  isNothing: 'Returns true if the value under test is empty or nil.',
  isEqualTo: 'Returns true if the 2 provided values are deeply equal.',
  isLessThanEqualTo: 'Returns true if the second value is less than the first value.',
  isGreaterThanEqualTo: 'Returns true if the second value is greater than the first value.',
  cleanDataByKeys:
    'Removes values from an array or object by applying provided predicate on keys or indices.',
  testRegex: 'Returns boolean value by applying provided regex on given value.'
});
