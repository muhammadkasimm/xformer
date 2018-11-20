'use strict';

// imports
const R = require('ramda');

// helpers
const sayHello = R.always('Hello, world!');

// exports
module.exports = {
  sayHello: sayHello
};
