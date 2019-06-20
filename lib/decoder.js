"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActionInfo = exports.getActionName = exports.decodePipe = exports.decodeAction = exports.translateObjectToString = exports.decodeObjectAction = exports.decodeStringyAction = exports.evaluate = void 0;

var R = _interopRequireWildcard(require("ramda"));

var P = _interopRequireWildcard(require("./palette"));

var H = _interopRequireWildcard(require("./helpers"));

var _main = require("./main");

var _constants = require("./constants");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var evaluate = R.curry(function (str) {
  var context = (0, _main.getContext)();
  return R.pipe(R.tryCatch(eval, R.always(str)), R.when(R.test(/^[\$.]/), R.pipe(R.replace(/^[\$]\./, ''), R.prop(R.__, context))), R.when(R.test(/^[X.]/), R.pipe(R.split('.'), R.last, decodeStringyAction)), R.when(R.both(H.typeMatches('object'), R.propSatisfies(R.has(R.__, P), 'name')), decodeObjectAction))(str);
});
/**
 * @param  {string} action
 * @returns {Function}
 *
 * Takes a string representation of a function from the command pallete. It then picks the function name and the provided
 * params from this string and returns the function with the evaluated params. If no matching function is found, R.identity
 * is returned in its place.
 */

exports.evaluate = evaluate;
var decodeStringyAction = R.curry(function (action) {
  return R.pipe(R.juxt([H.getFirstMatch(_constants.ALIAS_REGEX), R.pipe(R.replace(_constants.ALIAS_REGEX, ''), R.replace(_constants.OPENING_PARAN_REGEX, ''), R.replace(_constants.CLOSING_PARAN_REGEX, ''), function (x) {
    return "[".concat(x, "]");
  }, eval, R.map(evaluate))]), R.ifElse(R.propSatisfies(R.has(R.__, P), 0), R.ifElse(R.propSatisfies(H.isSomething, 1), function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        a = _ref2[0],
        p = _ref2[1];

    return P[a].apply(P, _toConsumableArray(p));
  }, function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        a = _ref4[0],
        p = _ref4[1];

    return P[a];
  }), R.identity))(action);
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

exports.decodeStringyAction = decodeStringyAction;
var decodeObjectAction = R.curry(function (action) {
  var evaluateParams = R.map(evaluate);
  return R.cond([[R.propSatisfies(R.has(R.__, P), 'name'), function (_ref5) {
    var name = _ref5.name,
        _ref5$params = _ref5.params,
        params = _ref5$params === void 0 ? [] : _ref5$params;
    return H.isSomething(params) ? P[name].apply(P, _toConsumableArray(evaluateParams(params))) : P[name];
  }], [R.allPass([R.has('fn'), R.propSatisfies(H.typeMatches('function'), 'fn')]), function (_ref6) {
    var name = _ref6.name,
        fn = _ref6.fn,
        _ref6$params = _ref6.params,
        params = _ref6$params === void 0 ? [] : _ref6$params;
    return H.isSomething(params) ? fn.apply(void 0, _toConsumableArray(evaluateParams(params))) : fn;
  }], [R.T, R.identity]])(action);
});
/**
 * @param  {Object} action
 * @returns {string}
 *
 * Takes a JSON representation of an action and converts it into stringy representation.
 */

exports.decodeObjectAction = decodeObjectAction;
var translateObjectToString = R.curry(function (action) {
  return R.converge(R.concat, [R.propOr('_anonymousFn_', 'name'), R.ifElse(R.propSatisfies(H.isSomething, 'params'), R.pipe(R.prop('params'), R.map(R.toString), R.join(', '), function (x) {
    return "(".concat(x, ")");
  }), R.always(''))])(action);
});
/**
 * @param  {Array<string>} pipe
 * @returns {Array<Function>}
 *
 * Takes an array of strings and replaces each string with the matching function from the command pallete; if no
 * matching function is found, R.identity is put in its place. R.identity is a function that returns the value
 * it was called with. Command pallete is located in src/XFormer/xformerFns.
 */

exports.translateObjectToString = translateObjectToString;
var decodeAction = R.curry(function (action) {
  try {
    return R.cond([[H.typeMatches('string'), decodeStringyAction], [H.typeMatches('object'), decodeObjectAction], [H.typeMatches('array'), R.pipe(decodePipe, R.apply(R.pipe))]])(action);
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

exports.decodeAction = decodeAction;
var decodePipe = R.curry(function (pipe) {
  return R.map(decodeAction, pipe);
});
/**
 * @param  {string | Object} action
 * @returns {string} name of the action
 *
 * Takes a string or Object representation of an action and returns the name of the action.
 */

exports.decodePipe = decodePipe;
var getActionName = R.curry(function (action) {
  return R.cond([[H.typeMatches('string'), R.identity], [H.typeMatches('object'), translateObjectToString], [H.typeMatches('array'), R.pipe(R.map(getActionName), R.join(', '))]])(action);
});
/**
 * @param  {string | Object} action
 * @returns {string} name of the action
 *
 * Takes a string or Object representation of an action and returns the name of the action.
 */

exports.getActionName = getActionName;
var getActionInfo = R.curry(function (action) {
  return R.cond([[H.typeMatches('string'), R.pipe(H.getFirstMatch(_constants.ALIAS_REGEX), R.prop(R.__, _constants.PALETTE_INFO))], [H.typeMatches('object'), R.ifElse(R.has('info'), R.propOr('No description available.', 'info'), R.pipe(R.prop('name'), H.getFirstMatch(_constants.ALIAS_REGEX), R.propOr('No description available.', R.__, _constants.PALETTE_INFO)))], [H.typeMatches('array'), R.pipe(R.map(getActionInfo), R.join('\n'))]])(action);
});
exports.getActionInfo = getActionInfo;