'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('date.js', 'date');
require('graceful-fs', 'fs');
require('map-cache', 'MapCache');
require('os-homedir', 'home');
require('kind-of', 'typeOf');
require('write-json');
require = fn;

/**
 * Read a JSON file.
 *
 * @param {String} `fp`
 * @return {Object}
 */

utils.readFile = function(fp) {
  try {
    var str = utils.fs.readFileSync(path.resolve(fp), 'utf8');
    return JSON.parse(str);
  } catch (err) {}
  return {};
};

/**
 * Define a property on the given `obj`
 */

utils.define = function(obj, prop, fn) {
  var cached;
  Object.defineProperty(obj, prop, {
    configurable: true,
    enumerable: true,
    set: function(val) {
      cached = val;
    },
    get: function() {
      if (cached) return cached;
      if (typeof fn === 'function') {
        return (cached = fn.call(this));
      }
      return (cached = fn);
    }
  });
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
