## XFormer: Easier Data Transformations

XFormer makes data transformations easy on your cognition and hassle-free.

#### Features

- Provides an intuitive way to express transformation pipelines
- Supports a flexible palette of actions
- Provides 2 ways of describing an action: a string or JSON

#### Installation

```
npm i @muhammadkasim/xformer --save
```

#### Usage

With Xformer, you can execute a simple pipeline of actions by providing a list of action descriptions to the `executePipe` method on the imported instance.

```javascript
import X from '@muhammadkasim/xformer';

const mock_data = [{ a: 1 }, { a: 2 }, { b: 3 }];
X.executePipe(['mergeWithAdd', 'getAvg'], mock_data);

// Returns an object containing the result of executing the pipeline and the
// corresponding result of each step.
// {
//   buffer: [
//     { data: [{a: 1}, {a: 2}, {b: 3}], title: 'Original Data' },
//     { data: {a: 3, b: 3}, title: 'mergeWithAdd' },
//     { data: 3, title: 'getAvg' }
//   ],
//   result: 3
// }
```

An action can be described either as a string or JSON.

```javascript
X.executePipe([{ name: 'pickByRegex', params: ['a'] }, 'getAvg'], mock_data); //=> 1.5
```

Xformer also provides a short hand for passing params when describing an action in string form.

```javascript
X.executePipe(['pickByRegex(a)', 'getAvg'], mock_data); //=> 1.5
```

You can perform also perform multiple actions on the same data.

```javascript
X.executePipe(
  [
    ['pickFrom([0, "a"])', 'pickFrom([2, "b"])'], //=> [1, 3]
    'getAvg'
  ],
  mock_data
); //=> 2
```

If you need to pass some external values to assist execution of the pipe, you can do so like shown below.

```javascript
X.executePipe(['mergeWithAdd', 'getRate($.interval)'], mock_data, { interval: 30 }); //=> {a: 0.1, b: 0.1}
```

You can also group and `execute` multiple pipelines on the same data. This group of pipelines is called a query and can be a list of pipelines or a JSON structure where value in each key-value pair is a pipeline.

```javascript
X.execute(
  {
    avg_by_key: ['mergeWithAdd', 'getAvg'],
    rate_by_30: ['mergeWithAdd', 'getRate($.interval)']
  },
  mock_data
);

// Takes a query and data as input and executes all pipelines within the query, with
// each pipeline receiving the provided data.
// {
//     avg_by_key: {
//         buffer: [
//           { data: [{a: 1}, {a: 2}, {b: 3}], title: 'Original Data' },
//           { data: {a: 3, b: 3}, title: 'mergeWithAdd' },
//           { data: 3, title: 'getAvg' }
//         ],
//         result: 3
//     },
//     rate_by_30: {
//         buffer: [
//           { data: [{a: 1}, {a: 2}, {b: 3}], title: 'Original Data' },
//           { data: {a: 3, b: 3}, title: 'mergeWithAdd' },
//           { data: {a: 0.1, b: 0.1}, title: 'getRate($.interval)' }
//         ],
//         result: {a: 0.1, b: 0.1}
//     }
// }
```

#### Action Palette

You can describe following actions in transformation pipelines.

| Action                     | Params                                              | Description                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pickFrom`                 | `path: Array<string>, data: Object`                 | Retrieves value at the specified path from a JSON object.                                                                                                                                                                                                                                                                                                                                    |
| `pickByRegex`              | `regex: string, data: Object`                       | Filters key-value pairs from a JSON object when key matches the specified regular expression (or string).                                                                                                                                                                                                                                                                                    |
| `mergeWithAdd`             | `data: Array<Object>`                               | Merges a list of JSON objects into a single JSON object by adding values having the same key; treats a non-number value as zero.                                                                                                                                                                                                                                                             |
| `mergeWithSubtract`        | `data: Array<Object>`                               | Merges a list of JSON objects into a single JSON object by subtracting values having the same key; treats a non-number value as zero.                                                                                                                                                                                                                                                        |
| `getUsedMemory`            | `data: (Object, Array)`                             | Calculates percentages of used memory when given a list or JSON object containing percentages of free memory.                                                                                                                                                                                                                                                                                |
| `getAvg`                   | `data: (Object, Array)`                             | Calculates average of values in a list or JSON object; ignores values that are not numbers.                                                                                                                                                                                                                                                                                                  |
| `differential`             | `data: Object`                                      | Applies iterative subtraction over consecutive values in a JSON object such that `T[i] = T[i] - T[i-1]`; first value is ignored in the result.                                                                                                                                                                                                                                               |
| `sumAll`                   | `data: (Object, Array)`                             | Recieves an array or object, adds all the values and return a single number. All non-number values are treated as zero.                                                                                                                                                                                                                                                                      |
| `defaultAll`               | `data: (Object, Array)`                             | Recieves an array or object and replaces each junky value with the provided fallback value. A value is considered junk if it can not be converted to a valid number.                                                                                                                                                                                                                         |
| `getRate`                  | `interval: number, data: (Object, Array)`           | Calculates rate by dividing each value in a list or JSON object by the provided interval; ignores values that are not numbers.                                                                                                                                                                                                                                                               |
| `runAll`                   | `pipes: Array, data: any`                           | Execute a list of pipelines on provided data.                                                                                                                                                                                                                                                                                                                                                |
| `map`                      | `action: (string, Object, Array), data: any`        | Takes an action and data as input and returns the result of performing that action on each value in the data.                                                                                                                                                                                                                                                                                |
| `sortAscending`            | `key: any, data: (Array, Object)`                   | Sorts an array or object in ascending order. When data is an array of objects or arrays, key refers to the value with respect to which you want the data sorted. When data is an object, key can either be `0` (sort by key) or `1` (sort by value); sorted object is returned as a list of `[key, value]` pairs. When data is simply an array of numbers, key is ignored even if provided.  |
| `sortDescending`           | `key: any, data: (Array, Object)`                   | Sorts an array or object in descending order. When data is an array of objects or arrays, key refers to the value with respect to which you want the data sorted. When data is an object, key can either be `0` (sort by key) or `1` (sort by value); sorted object is returned as a list of `[key, value]` pairs. When data is simply an array of numbers, key is ignored even if provided. |
| `cleanData`                | `predicates: Array, data: (Array, Object)`          | Removes values from an array or object by applying the provided predicate functions on each value in an OR fashion. Additionally for an object, if a key is empty, it is removed regardless of the value.                                                                                                                                                                                    |
| `takeTopAndCombineOthers`  | `x: number, xformer: Action, data: (Array, Object)` | Takes top `x` items from a list and combines remaining by applying provided xformer. Returns `[...topX, others]`.                                                                                                                                                                                                                                                                            |
| `takeTopPairsAndAddOthers` | `x: number, data: (Array, Object)`                  | Takes top `x` pairs from a list of pairs and combines remaining pairs by adding values on index `1` of each pair; a pair should be of form `[x: any, y: number]`. Returns `[topX, others]`.                                                                                                                                                                                                  |
| `isNothing`                | `value: any`                                        | Returns true if the value under test is empty or nil.                                                                                                                                                                                                                                                                                                                                        |
| `isEqualTo`                | `x1: any, x2: any`                                  | Returns true if the 2 provided values are deeply equal.                                                                                                                                                                                                                                                                                                                                      |
| `isLessThanEqualTo`        | `x1: number, x2: number`                            | Returns true if the second value is less than the first value.                                                                                                                                                                                                                                                                                                                               |
| `isGreaterThanEqualTo`     | `x1: number, x2: number`                            | Returns true if the second value is greater than the first value.                                                                                                                                                                                                                                                                                                                            |

`* Action = string|Object|Array`

`* Pipe = Array<action>`
