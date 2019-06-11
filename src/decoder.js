/*
  Author: Muhammad Kasim
  This file contains the parsing logic for XFormer queries.
*/

import * as R from 'ramda';
import * as P from './palette';
import * as H from './helpers';
import { getContext } from './main';
import { ALIAS_REGEX, OPENING_PARAN_REGEX, CLOSING_PARAN_REGEX, PALETTE_INFO } from './constants';

export const evaluate = R.curry(str => {
  const context = getContext();
  return R.pipe(
    R.tryCatch(eval, R.always(str)),
    R.when(
      R.test(/^[\$.]/),
      R.pipe(
        R.replace(/^[\$]\./, ''),
        R.prop(R.__, context)
      )
    ),
    R.when(
      R.test(/^[X.]/),
      R.pipe(
        R.split('.'),
        R.last,
        decodeStringyAction
      )
    ),
    R.when(
      R.both(H.typeMatches('object'), R.propSatisfies(R.has(R.__, P), 'name')),
      decodeObjectAction
    )
  )(str);
});

/**
 * @param  {string} action
 * @returns {Function}
 *
 * Takes a string representation of a function from the command pallete. It then picks the function name and the provided
 * params from this string and returns the function with the evaluated params. If no matching function is found, R.identity
 * is returned in its place.
 */
export const decodeStringyAction = R.curry(action => {
  return R.pipe(
    R.juxt([
      H.getFirstMatch(ALIAS_REGEX),
      R.pipe(
        R.replace(ALIAS_REGEX, ''),
        R.replace(OPENING_PARAN_REGEX, ''),
        R.replace(CLOSING_PARAN_REGEX, ''),
        x => `[${x}]`,
        eval,
        R.map(evaluate)
      )
    ]),
    R.ifElse(
      R.propSatisfies(R.has(R.__, P), 0),
      R.ifElse(R.propSatisfies(H.isSomething, 1), ([a, p]) => P[a](...p), ([a, p]) => P[a]),
      R.identity
    )
  )(action);
});

/**
 * @param  {Object} action
 * @returns {Function}
 *
 * Takes a JSON representation of a function from the command pallete and returns the function with the evaluated params. If no matching function is found, R.identity
 * is returned in its place.
 */
// TODO: You should maybe consult a map for checking if the provided action even needs
// the func or params or not. Maybe the user made a mistake or is just trying to mess
// with the parser.
export const decodeObjectAction = R.curry(action => {
  const evaluateParams = R.map(evaluate);

  return R.cond([
    [
      R.propSatisfies(R.has(R.__, P), 'name'),
      ({ name, params = [] }) => {
        return H.isSomething(params) ? P[name](...evaluateParams(params)) : P[name];
      }
    ],
    [
      R.allPass([R.has('fn'), R.propSatisfies(H.typeMatches('function'), 'fn')]),
      ({ name, fn, params = [] }) => (H.isSomething(params) ? fn(...evaluateParams(params)) : fn)
    ],
    [R.T, R.identity]
  ])(action);
});

/**
 * @param  {Object} action
 * @returns {string}
 *
 * Takes a JSON representation of an action and converts it into stringy representation.
 */
export const translateObjectToString = R.curry(action => {
  return R.converge(R.concat, [
    R.propOr('_anonymousFn_', 'name'),
    R.ifElse(
      R.propSatisfies(H.isSomething, 'params'),
      R.pipe(
        R.prop('params'),
        R.map(R.toString),
        R.join(', '),
        x => `(${x})`
      ),
      R.always('')
    )
  ])(action);
});

/**
 * @param  {Array<string>} pipe
 * @returns {Array<Function>}
 *
 * Takes an array of strings and replaces each string with the matching function from the command pallete; if no
 * matching function is found, R.identity is put in its place. R.identity is a function that returns the value
 * it was called with. Command pallete is located in src/XFormer/xformerFns.
 */
export const decodeAction = R.curry(action => {
  try {
    return R.cond([
      [H.typeMatches('string'), decodeStringyAction],
      [H.typeMatches('object'), decodeObjectAction],
      [
        H.typeMatches('array'),
        R.pipe(
          decodePipe,
          R.apply(R.pipe)
        )
      ]
    ])(action);
  } catch (error) {
    return action;
  }
});

/**
 * @param  {Array<string>} pipe
 * @returns {Array<Function>}
 *
 * Takes an array of strings and replaces each string with the matching function from the command pallete; if no
 * matching function is found, R.identity is put in its place. R.identity is a function that returns the value
 * it was called with. Command pallete is located in src/XFormer/xformerFns.
 */
export const decodePipe = R.curry(pipe => {
  return R.map(decodeAction, pipe);
});

/**
 * @param  {string | Object} action
 * @returns {string} name of the action
 *
 * Takes a string or Object representation of an action and returns the name of the action.
 */
export const getActionName = R.curry(action => {
  return R.cond([
    [H.typeMatches('string'), R.identity],
    [H.typeMatches('object'), translateObjectToString],
    [
      H.typeMatches('array'),
      R.pipe(
        R.map(getActionName),
        R.join(', ')
      )
    ]
  ])(action);
});

/**
 * @param  {string | Object} action
 * @returns {string} name of the action
 *
 * Takes a string or Object representation of an action and returns the name of the action.
 */
export const getActionInfo = R.curry(action => {
  return R.cond([
    [
      H.typeMatches('string'),
      R.pipe(
        H.getFirstMatch(ALIAS_REGEX),
        R.prop(R.__, PALETTE_INFO)
      )
    ],
    [
      H.typeMatches('object'),
      R.ifElse(
        R.has('info'),
        R.propOr('No description available.', 'info'),
        R.pipe(
          R.prop('name'),
          H.getFirstMatch(ALIAS_REGEX),
          R.propOr('No description available.', R.__, PALETTE_INFO)
        )
      )
    ],
    [
      H.typeMatches('array'),
      R.pipe(
        R.map(getActionInfo),
        R.join('\n')
      )
    ]
  ])(action);
});
