'use strict';

var path = require('path');
var utils = require('./utils');

/**
 * Expose `DateStore`
 */

module.exports = DateStore;

/**
 * Create a new `DateStore` with the given options.
 *
 * ```js
 * var dateStore = new DateStore();
 * ```
 *
 * @param {Object} `options` Optionally pass a `dir` and/or `path` to use for the JSON store. Default is `~/.date-store.json`
 * @api public
 */

function DateStore(options) {
  this.options = options || {};
  this.cache = new utils.MapCache(this.dates);
}

/**
 * Store a `new Date()` for `key`.
 *
 * ```js
 * dateStore.set(key);
 * ```
 *
 * @name .set
 * @param {String} `key`
 * @return {Object} Returns the instance for chaining.
 * @api public
 */

DateStore.prototype.set = function(key) {
  this.cache.set(key, String(new Date()));
  this.save();
  return this;
};

/**
 * Get the stored date object for `key`, or, if an instance of `Date` is passed,
 * it will be returned directly.
 *
 * ```js
 * dateStore.set('foo');
 * console.log(dateStore.get('foo'));
 * //=> Mon Apr 11 2016 06:18:31 GMT-0400 (EDT)
 *
 * console.log(dateStore.get('foo') instanceof Date);
 * //=> true
 * ```
 *
 * @name .get
 * @param {String} `key` The name of the stored date to get.
 * @return {Date} Returns the date object for `key`
 * @api public
 */

DateStore.prototype.get = function(key) {
  if (utils.typeOf(key) !== 'date') {
    key = this.getRaw(key);
  }
  return new Date(key);
};

/**
 * Get the "raw" JSON-stringified date that was originally stored for `key`.
 *
 * ```js
 * dateStore.set('foo');
 * console.log(dateStore.getRaw('foo'));
 * //=> Mon Apr 11 2016 08:39:10 GMT-0400 (EDT)
 *
 * console.log(dateStore.getRaw('foo') instanceof Date);
 * //=> false
 *
 * console.log(dateStore.get('foo') instanceof Date);
 * //=> true
 * ```
 *
 * @name .get
 * @param {String} `key` The name of the stored date to get.
 * @return {String} Returns the stringified date for `key`
 * @api public
 */

DateStore.prototype.getRaw = function(key) {
  return this.cache.get(key);
};

/**
 * Get the numeric value corresponding to the time for stored date `key`,
 * according to universal time. See the MDN docs for [.getTime][get-time].
 *
 * ```js
 * dateStore.set('foo');
 * console.log(dateStore.getTime('foo'));
 * //=> 1460378350000
 * ```
 *
 * @name .getTime
 * @param {String} `key` The name of the stored date to get.
 * @return {Number}
 * @api public
 */

DateStore.prototype.getTime = function(key) {
  return this.get(key).getTime();
};

/**
 * Create a JavaScript date object from the given `str`. You may also supply
 * an optional offset to the starting date. offset defaults to the current
 * date and time. See [date.js][] for more details or to report date parsing
 * related issues.
 *
 * ```js
 * console.log(dateStore.date('1 day from now'));
 * //=> Tue Apr 12 2016 10:05:12 GMT-0400 (EDT)
 * ```
 * @name .date
 * @param {String} `str` A human-readable string to pass to [date.js][]
 * @return {Date} JavaScript Date object
 * @api public
 */

DateStore.prototype.date = function() {
  return utils.date.apply(utils.date, arguments);
};

/**
 * Get the numeric value corresponding to the time for the date object returned
 * from the [.date](#date) method.
 *
 * ```js
 * console.log(dateStore.date('1 day from now'));
 * //=> Tue Apr 12 2016 10:05:12 GMT-0400 (EDT)
 * ```
 * @name .date
 * @param {String} `str` A human-readable string to pass to [date.js][]
 * @return {Date} JavaScript Date object
 * @api public
 */

DateStore.prototype.time = function() {
  return this.date.apply(this, arguments).getTime();
};

/**
 * Returns the difference in seconds between stored date `key` and
 * the date returned from calling [date.js][] on the given `timespan`.
 *
 * ```js
 * console.log(dateStore.diff('foo', '10 minutes ago'));
 * //=> 338563
 * ```
 * @name .diff
 * @param {String} `key` The stored date to compare
 * @param {String} `timespate` A human-readable string to pass to [date.js][]
 * @return {Number} The difference in seconds between the two dates, or `NaN` if invalid.
 * @api public
 */

DateStore.prototype.diff = function(key, timespan) {
  return this.getTime(key) - this.time(timespan);
};

/**
 * Calls [.getTime](#getTime) and adds the result to a `._time` property,
 * which is then used by other methods chained from `.lastSaved`.
 *
 * ```js
 * dateStore.set('bar');
 * dateStore.lastSaved('bar');
 * console.log(dateStore._time);
 * //=> 1460378350000
 * console.log(dateStore.lastSaved('bar').moreThan('31 minutes ago'));
 * //= false
 * console.log(dateStore.lastSaved('bar').moreThan('31 minutes ago'));
 * ```
 * @param {String} `key` The name of the stored date to set on `._time`
 * @return {Object} Returns the instance for chaining.
 * @api public
 */

DateStore.prototype.lastSaved = function(key) {
  this._time = this.getTime(key);
  return this;
};

/**
 * Calls [.time](#time) on the given `timespan`, and returns true if
 * the returned time is older than `this._time`. _This method must
 * be chained from [.lastSaved](#lastSaved)._
 *
 * ```js
 * dateStore.set('bar');
 *
 * console.log(dateStore.lastSaved('bar').moreThan('31 minutes ago'));
 * //= false
 * console.log(dateStore.lastSaved('bar').lessThan('1 minutes ago'));
 * //=> true
 * ```
 * @param {String} `key` The name of the stored date to set on `._time`
 * @return {Object} Returns the instance for chaining.
 * @api public
 */

DateStore.prototype.moreThan = function(timespan) {
  return this._time && this._time < this.time(timespan);
};

/**
 * Calls `.time()` on the given `timespan`, and returns true if
 * the returned time is newer than `this._time`. _This method must
 * be chained from [.lastSaved](#lastSaved)._
 *
 * ```js
 * dateStore.set('bar');
 *
 * console.log(dateStore.lastSaved('bar').moreThan('31 minutes ago'));
 * //= false
 * console.log(dateStore.lastSaved('bar').lessThan('1 minutes ago'));
 * //=> true
 * ```
 * @param {String} `key` The name of the stored date to set on `._time`
 * @return {Object} Returns the instance for chaining.
 * @api public
 */

DateStore.prototype.lessThan = function(timespan) {
  return this._time && this._time > this.time(timespan);
};

/**
 * Return true if a date is stored for `key`, false if `undefined`.
 *
 * ```js
 * dateStore.set('foo');
 * console.log(dateStore.has('foo'));
 * //=> true
 * ```
 *
 * @name .has
 * @param {String} `key`
 * @return {Boolean}
 * @api public
 */

DateStore.prototype.has = function(key) {
  return this.cache.has(key);
};

/**
 * Delete a date from the store.
 *
 * ```js
 * dateStore.del('foo');
 * ```
 * @name .del
 * @param {String|Array} `key` Property name or array of property names.
 * @return {Object} Returns the instance for chaining.
 * @api public
 */

DateStore.prototype.del = function(key) {
  this.cache.del(key);
  this.save();
  return this;
};

/**
 * Persist the `dateStore.dates` cache to a JSON file at the currently defined [.path](#path).
 *
 * ```js
 * dateStore.save();
 * ```
 * @name .save
 * @api public
 */

DateStore.prototype.save = function() {
  utils.writeJson.sync(this.path, this.dates, this.options);
};

/**
 * Get or set the directory to use for the date store. Default is user home.
 * Report any OS-related user-home issues to [os-homedir][].
 *
 * ```js
 * console.log(dateStore.dir);
 * //=> 'Users/jonschlinkert'
 * ```
 * @name .dir
 * @api public
 */

utils.define(DateStore.prototype, 'dir', function() {
  return this.options.dir ? path.resolve(this.options.dir) : utils.home();
});

/**
 * Get or set the absolute path to use for the date store.
 * Default is `dateStore.dir + '/.date-store.json'`.
 *
 * ```js
 * console.log(dateStore.path);
 * //=> 'Users/jonschlinkert/.date-store.json'
 * ```
 * @name .path
 * @api public
 */

utils.define(DateStore.prototype, 'path', function() {
  return typeof this.options.path === 'undefined'
    ? path.resolve(this.dir, '.date-store.json')
    : path.resolve(this.dir, this.options.path);
});

/**
 * When an instance of `DateStore` is created, if a store exists at the
 * currently defined [.path](#path), the `.dates` cache is primed with the
 * object created by calling `JSON.parse` on the contents of that file.
 * Otherwise an empty object is used.
 *
 * ```js
 * console.log(dateStore.dates);
 * //=> {}
 *
 * datesStore.set('foo');
 * datesStore.set('bar');
 *
 * console.log(dateStore.dates);
 * // { foo: 'Mon Apr 11 2016 08:39:10 GMT-0400 (EDT)',
 * //   bar: 'Mon Apr 11 2016 08:39:10 GMT-0400 (EDT)' }
 * ```
 * @name .dates
 * @api public
 */

utils.define(DateStore.prototype, 'dates', function() {
  return utils.readFile(this.path);
});
