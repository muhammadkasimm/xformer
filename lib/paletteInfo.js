'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const PALETTE_INFO = exports.PALETTE_INFO = {
  pickFrom: 'Retrieves value at the specified path from a JSON object.',
  pickByRegex: 'Filters key-value pairs from a JSON object when key matches the specified regular expression (or string).',
  sumAll: 'Sums up all values in a list or JSON object; ignores values that are not numbers.',
  mergeWithAdd: 'Merges a list of JSON objects into a single JSON object by adding values having the same key; treats a non-number value as zero.',
  mergeWithSubtract: 'Merges a list of JSON objects into a single JSON object by subtracting values having the same key; treats a non-number value as zero.',
  getUsedMemory: 'Calculates percentages of used memory when given a list or JSON object containing percentages of free memory.',
  getAvg: 'Calculates average of values in a list or JSON object; ignores values that are not numbers.',
  differential: 'Applies iterative subtraction over consecutive values in a JSON object such that T[i] = T[i] - T[i-1]; first value is ignored in the result.',
  defaultAll: 'Replaces non-number values in a list or JSON object with the specified value.',
  getRate: 'Calculates rate by dividing each value in a list or JSON object by the provided interval; ignores values that are not numbers.',
  runAll: 'Execute a list of pipelines on provided data.'
};