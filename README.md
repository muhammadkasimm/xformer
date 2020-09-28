## XFormer: Easier Data Transformations

XFormer makes data transformations easy on your cognition and hassle-free.

Read complete docs [here](https://muhammadkasimm.github.io/xformer/).



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
