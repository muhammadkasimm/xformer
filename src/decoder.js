/*
  Author: Muhammad Kasim
  This file contains the parsing logic for XFormer queries.
*/

import * as R from 'ramda';
import * as P from './palette';
import * as _ from './helpers';
import { getContext } from './main';
import { ALIAS_REGEX, OPENING_PARAN_REGEX, CLOSING_PARAN_REGEX } from './constants';

const isPaletteAction = R.propSatisfies(R.has(R.__, P), 0);

const isHelperAction = R.propSatisfies(R.has(R.__, _), 0);

export function evaluate(str) {
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
      R.both(
        _.typeMatches('object'),
        R.propSatisfies(R.anyPass([R.has(R.__, P), R.has(R.__, _)]), 'name')
      ),
      decodeObjectAction
    )
  )(str);
}

/**
 * @param  {string} action
 * @returns {Function}
 *
 * Takes a string representation of a function from the command pallete. It then picks the function name and the provided
 * params from this string and returns the function with the evaluated params. If no matching function is found, R.identity
 * is returned in its place.
 */
export function decodeStringyAction(action) {
  return R.pipe(
    R.juxt([
      _.getFirstMatch(ALIAS_REGEX),
      R.pipe(
        R.replace(ALIAS_REGEX, ''),
        R.replace(OPENING_PARAN_REGEX, ''),
        R.replace(CLOSING_PARAN_REGEX, ''),
        x => `[${x}]`,
        eval,
        R.map(evaluate)
      )
    ]),
    R.cond([
      [
        isPaletteAction,
        R.ifElse(R.propSatisfies(_.isSomething, 1), ([a, p]) => P[a](...p), ([a, p]) => P[a])
      ],
      [
        isHelperAction,
        R.ifElse(R.propSatisfies(_.isSomething, 1), ([a, p]) => _[a](...p), ([a, p]) => _[a])
      ],
      [R.T, R.identity]
    ])
  )(action);
}

/**
 * @param  {Object} action
 * @returns {Function}
 *
 * Takes a JSON representation of a function from the command pallete and returns the function with the evaluated params. If no matching function is found, R.identity
 * is returned in its place.
 */
// TODO: You should maybe consult a map for checking if the provided action even needs
// the func or params paramater or not. Maybe the user made a mistake or is just trying to mess
// with the parser.
export function decodeObjectAction(action) {
  const { name, params } = action;

  if (R.has(name, P)) {
    let _params = [];
    if (_.isSomething(params)) _params = _.typeMatches('array', params) ? params : [params];
    return P[name](...R.map(evaluate, _params));
  } else if (R.has(name, _)) {
    let _params = [];
    if (_.isSomething(params)) _params = _.typeMatches('array', params) ? params : [params];
    return _[name](...R.map(evaluate, _params));
  } else {
    return R.identity;
  }
}

/**
 * @param  {Object} action
 * @returns {string}
 *
 * Takes a JSON representation of an action and converts it into stringy representation.
 */
export function translateObjectToString(action) {
  return R.converge(R.concat, [
    R.prop('name'),
    R.ifElse(
      R.propSatisfies(_.isSomething, 'params'),
      R.pipe(
        R.prop('params'),
        R.map(R.toString),
        R.join(', '),
        x => `(${x})`
      ),
      R.always('')
    )
  ])(action);
}

/**
 * @param  {Array<string>} pipe
 * @returns {Array<Function>}
 *
 * Takes an array of strings and replaces each string with the matching function from the command pallete; if no
 * matching function is found, R.identity is put in its place. R.identity is a function that returns the value
 * it was called with. Command pallete is located in src/XFormer/xformerFns.
 */
export function decodeAction(action) {
  try {
    return R.cond([
      [_.typeMatches('string'), decodeStringyAction],
      [_.typeMatches('object'), decodeObjectAction],
      [
        _.typeMatches('array'),
        R.pipe(
          decodePipe,
          R.apply(R.pipe)
        )
      ]
    ])(action);
  } catch (error) {
    return action;
  }
}

/**
 * @param  {Array<string>} pipe
 * @returns {Array<Function>}
 *
 * Takes an array of strings and replaces each string with the matching function from the command pallete; if no
 * matching function is found, R.identity is put in its place. R.identity is a function that returns the value
 * it was called with. Command pallete is located in src/XFormer/xformerFns.
 */
export function decodePipe(pipe) {
  return R.map(decodeAction, pipe);
}

/**
 * @param  {string | Object} action
 * @returns {string} name of the action
 *
 * Takes a string or Object representation of an action and returns the name of the action.
 */
export function getActionName(action) {
  return R.cond([
    [_.typeMatches('string'), R.identity],
    [_.typeMatches('object'), translateObjectToString],
    [
      _.typeMatches('array'),
      R.pipe(
        R.map(getActionName),
        R.join(', ')
      )
    ]
  ])(action);
}
