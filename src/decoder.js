/*
  Author: Muhammad Kasim
  This file contains the parsing logic for XFormer queries.
*/

import * as R from 'ramda';
import * as P from './palette';
import * as _ from './helpers';

const ALIAS_REGEX = /^[a-zA-z0-9_]*/;
const OPENING_PARAN_REGEX = /^[\(]?/;
const CLOSING_PARAN_REGEX = /[\)]?$/;
const SEPARATOR_REGEX = /[,][ ]?/;

/**
 * @param  {string} action
 * @returns {Function}
 *
 * Takes a string representation of a function from the command pallete. It then picks the function name and the provided
 * params from this string and returns the function with the evaluated params. If no matching function is found, R.identity
 * is returned in its place.
 */
function decodeStringyAction(action) {
  return R.pipe(
    R.juxt([
      _.getFirstMatch(ALIAS_REGEX),
      R.pipe(
        R.replace(ALIAS_REGEX, ''),
        R.replace(OPENING_PARAN_REGEX, ''),
        R.replace(CLOSING_PARAN_REGEX, ''),
        R.split(SEPARATOR_REGEX),
        R.without(['', undefined]),
        R.map(eval)
      )
    ]),
    R.ifElse(
      R.pipe(
        R.prop(0),
        R.has(R.__, P)
      ),
      R.ifElse(
        R.pipe(
          R.prop(1),
          _.isSomething
        ),
        ([a, p]) => P[a](...p),
        ([a, p]) => P[a]
      ),
      R.identity
    )
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
function decodeObjectAction(action) {
  const { name, params, func } = action;

  if (R.has(name, P)) {
    let _func = [];
    let _params = [];

    if (_.typeMatches('array', func) && _.isSomething(func)) _func = decodePipe(func);
    if (_.isSomething(params)) _params = _.typeMatches('array', params) ? params : [params];
    if (_.isSomething(_func)) return P[name](R.pipe(..._func), ..._params);
    return P[name](..._params);
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
function translateObjectToString(action) {
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
export function decodePipe(pipe) {
  return R.map(
    R.cond([
      [_.typeMatches('string'), decodeStringyAction],
      [_.typeMatches('object'), decodeObjectAction],
      [_.typeMatches('array'), decodePipe]
    ]),
    pipe
  );
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
