'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _merge = require('ramda/src/merge');

var _merge2 = _interopRequireDefault(_merge);

var _executor = require('./executor');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Xform {
  constructor() {
    this.$ = {};
  }

  /**
   * Helps initilaize or update external dependencies needed to run queries.
   *
   * @func
   * @returns {Object} $ // (external dependencies)
   * @example
   *      X.setExternals({ interval: 30 });
   */
  getExternals() {
    return this.$;
  }

  /**
   * Helps initilaize or update external dependencies needed to run queries.
   *
   * @func
   * @param  {Object} ext
   * @returns {undefined}
   * @example
   *      X.setExternals({ interval: 30 });
   */
  setExternals(ext = {}) {
    this.$ = (0, _merge2.default)(this.getExternals(), ext);
  }

  /**
   * Takes a query and data as input and executes all pipelines within the query, with each pipeline receiving the
   * provided data. A query can be a list of pipes or a JSON structure. A pipe is an array of action
   * descriptions. An action can be described as a string or JSON.
   *
   * Read docs for the available action palette.
   *
   * @func
   * @param  {Array|Object} query
   * @param  {any} data
   * @param  {Object} ext = {}
   * @returns {Object}
   * @example
   *      E.execute({ avg_by_30: ['getAvg', 'getRate(30)'] }, [1, 2 , 3]);
   *
   *      //=>
   *      {
   *        avg_by_30: {
   *          buffer: [
   *            { title: 'Original Data', data: [1, 2, 3] },
   *            { title: 'getAvg', data: 2 },
   *            { title: 'getRate(30)', data: 0.067 }
   *          ],
   *          result: 0.067
   *        }
   *      }
   */
  execute(query, data, ext = {}) {
    this.setExternals(ext);
    return _executor.execute.call(this, query, data);
  }

  /**
   * Takes a pipe and data as input and executes all actions from left to right. A pipe is an array of action
   * descriptions. An action can be described as a string or JSON.
   *
   * @func
   * @param  {Array<string|Object>} pipe
   * @param  {any} data
   * @param  {Object} ext = {}
   * @returns {Object}
   * @example
   *      E.executePipe(['getAvg', 'getRate(30)'], [1, 2 , 3]);
   *
   *      //=>
   *      {
   *        buffer: [
   *          { title: 'Original Data', data: [1, 2, 3] },
   *          { title: 'getAvg', data: 2 },
   *          { title: 'getRate(30)', data: 0.067 }
   *        ],
   *        result: 0.067
   *      }
   */
  executePipe(pipe, data, ext = {}) {
    this.setExternals(ext);
    return _executor.executePipe.call(this, pipe, data);
  }
}

exports.default = new Xform();