import * as R from 'ramda';
import * as D from './decoder';
import * as H from './helpers';
import { executeQuery } from './actions';
import { PALETTE_INFO, ALIAS_REGEX } from './constants';

/**
 * @param  {Function | Array<Function>} fn
 * @param  {Object} data
 * @returns {Object}
 *
 * Takes an action or list of actions, current state of accumulator and updates the accumulator
 * according to the action(s).
 */
const executeAction = R.curry((fn, data) => {
  return R.cond([
    [H.typeMatches('function'), R.applyTo(data)],
    [H.typeMatches('array'), R.map(R.applyTo(data))]
  ])(fn);
});

/**
 * @param  {Function | Array<Function>} fn
 * @param  {Object} info
 * @param  {Object} acc
 * @returns {Object}
 *
 * Takes an action or list of actions, current state of accumulator and updates the accumulator
 * according to the action(s).
 */
const updateAccumulator = R.curry((fn, info, acc) => {
  const executedData = executeAction(fn, acc.result);

  return R.pipe(
    R.over(
      R.lensProp('buffer'),
      R.append({
        title: info.name,
        data: executedData,
        info: info.info
      })
    ),
    R.set(R.lensProp('result'), executedData)
  )(acc);
});

/**
 * @param  {Array<string>} pipe
 * @param  {any} data
 * @returns {any}
 *
 * Takes a pipeline and data as input and performs two actions upon it.
 * 1. Decodes string and Object representations into functions from the command pallete.
 * 2. Executes the functions in a pipeline fashion while keeping track of the output of each step.
 *
 * Returns an object containing the result of executing the pipeline and the corresponding result of each step.
 */
export const executePipe = R.curry((pipe, data) => {
  return R.pipe(
    D.decodePipe,
    H.reduceIndexed(
      (acc, fn, idx) => {
        const info = {
          idx: idx,
          name: D.getActionName(R.nth(idx, pipe), idx),
          info: D.getActionInfo(R.nth(idx, pipe), idx)
        };
        try {
          return updateAccumulator(fn, info, acc);
        } catch (error) {
          console.error(error.stack);
          console.error('Failed to perform action:', {
            name: info.name,
            data: acc
          });
        }
      },
      {
        buffer: [],
        result: data
      }
    ),
    R.over(R.lensProp('buffer'), R.insert(0, { title: 'Original Data', data: data }))
  )(pipe);
});

/**
 * @param  {Object} query
 * @param  {Object} data
 * @returns {Object}
 *
 * Takes a query and data as input and executes all pipelines within the query, with each pipeline receiving the
 * provided data.
 */
export const execute = R.curry((query, data, dispatch) => {
  const result = R.map(executePipe(R.__, data), query);
  if (dispatch) dispatch(executeQuery(result));
  return result;
});
