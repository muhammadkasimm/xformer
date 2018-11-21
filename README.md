## xFormer: Easier Data Transformations

xFormer makes data transformations easy on your cognition and hassle-free.

#### Features

- Provides an intuitive way to express transformation pipelines
- Supports a flexible palette of actions
- Provides 2 ways of describing an action: a string or JSON

#### Usage

Using xFormer, data transformation pipelines can be expressed as a list of actions.

##### 1. Describing an action with `string`

An action can be described with a simple string. If need be, parameters can also be passed within parenthesis for instance, `pickByRegex(created)`.

Now let's make a couple of pipelines for a sample data from Reporting Engine.

```json
{
	"timeseries_data": {
		"nat44_data_session_created": {
			"1541671920000": 12555891,
			"1541672640000": 12570991,
			"1541673360000": 12586698
		},
		"nat44_data_session_created": {
			"1541671920000": 12614995,
			"1541672640000": 12631088,
			"1541673360000": 12646538
		},
		"dslite_data_session_freed": {
			"1541671920000": 12677359,
			"1541672640000": 12693833,
			"1541673360000": 12710132
		}
}
```

```javascript
// Simple pipeline
[
  'pickFrom([timseries_data])', // pick value at the specified path
  'pickByRegex(created)', // pick keys by matching with regex
  'mergeWithAdd', // add object values with the same timestamp/key
  'applyDifferential', // T[i] = T[i] - T[i-1], where i >= 1
  'sumAll' // sum all values with init value 0
][
  //Nested pipeline
  ('pickFrom([timseries_data])', // pick value at the specified path
  'pickByRegex(created)', // filter object by matching keys with regex
  'mergeWithAdd', // add object values with the same timestamp/key
  [
    'applyDifferential', // T[i] = T[i] - T[i-1], where i >= 1
    'rejectSmallerThan(100)' // only keep values greater than 100
  ],
  'sumAll(0)') // sum all values with init value 0
];
```

##### 2. Describing an action with JSON

An action can also be described using a predefined JSON schema. This schema contains multiple keys, each describing an aspect of the action.

| Key          | Type     | Default Value | Description                                                        |
| ------------ | -------- | :-----------: | ------------------------------------------------------------------ |
| `alias`      | `string` |               | Name of the action to be performed. This is the only required key. |
| `params`     | `Array`  |     `[]`      | List of parameters to be passed to the action.                     |
| `subProcess` | `Action` |  `undefined`  | A nested action to be executed after the main action.              |

Now let's describe a pipeline using JSON.

```javascript
[
  { alias: 'pickFrom', params: [['timseries_data']] },
  { alias: 'pickByRegex', params: ['created'] },
  { alias: 'mergeWithAdd' },
  { alias: 'applyDifferential' },
  { alias: 'sumAll', params: [10] } // set initial value to 10
];
```

JSON schema lends to an easier to understand structure for complex queries.

```javascript
[
  { alias: 'pickFrom', params: [['timseries_data']] },
  { alias: 'pickByRegex', params: ['created'] },
  { alias: 'mergeWithAdd' },
  {
    alias: 'applyDifferential',
    subProcess: [
      { alias: 'rejectSmallerThan', params: [100] },
      { alias: 'rejectGreaterThan', params: [1500] }
    ]
  },
  { alias: 'sumAll', params: [10] }
];
```

#### Action Palette

> NOTE: The action palette shown below has a very limited set of actions. Upon release, `v0.1` will actually have actions needed to support all the transformations in CGN app.

| Action              | Params                                | Description                                                                                                                                                         |
| ------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pickFrom`          | `path: Array<string>, data: Object`   | Picks value from data at the specified path                                                                                                                         |
| `pickByRegex`       | `regex: string, data: Object`         | Filter data object by keeping keys that match the provided regex                                                                                                    |
| `mergeWithAdd`      | `data: Array<Object>`                 | Merge list of objects by adding up values that have the same keys                                                                                                   |
| `applyDifferential` | `data: [Object, Array]`               | Subtracts current item from the previous iteratively                                                                                                                |
| `sumAll`            | `init: number, data: [Object, Array]` | Adds all values in a list or object with the initial value being `0`, if not provided. If a value in the list of object is not a number, it will considered as `0`. |
| `rejectSmallerThan` | `min: number, data: [Object, Array]`  | Rejects keys or items from an object or array that fall below the `min` value.                                                                                      |
| `rejectGreaterThan` | `max: number, data: [Object, Array]`  | Rejects keys or items from an object or array that are greater than the provided `max` value.                                                                       |
