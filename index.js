'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('assert');
const date = require('date.js');
const XDG_CONFIG_HOME = process.env.XDG_CONFIG_HOME;

/**
 * Create a new `DateStore` with the given `name` and `options`.
 *
 * ```js
 * const store = new DateStore();
 * ```
 *
 * @param {String} `name` If `options.path` is supplied, `name` will be ignored. Otherwise `name` is used as the filename for the JSON store: `~/.date-store/{name}.json`
 * @param {Object} `options` Optionally pass a `dir` and/or `path` to use for the JSON store. Default is `~/.date-store.json`
 * @api public
 */

class DateStore {
  constructor(name, options = {}) {
    if (typeof name !== 'string') {
      options = name || {};
      name = options.name;
    }

    const { debounce = 5, indent = 2, home, base } = options;
    this.name = name || 'date-store';
    this.options = options;
    this.debounce = debounce;
    this.indent = indent;
    this.home = home || XDG_CONFIG_HOME || path.join(os.homedir(), '.config');
    this.base = base || path.join(this.home, 'date-store');
    this.path = this.options.path || path.join(this.base, `${this.name}.json`);
  }

  /**
   * Store a `new Date()` for `key`.
   *
   * ```js
   * store.set(key);
   * ```
   * @param {string} `key`
   * @return {object} Returns the instance for chaining.
   * @api public
   */

  set(key) {
    this.dates[key] = String(new Date());
    this.save();
    return this;
  }

  /**
   * Get the stored date object for the given `key`
   *
   * ```js
   * store.set('foo');
   * console.log(store.get('foo'));
   * //=> Mon Apr 11 2016 06:18:31 GMT-0400 (EDT)
   *
   * console.log(store.get('foo') instanceof Date);
   * //=> true
   * ```
   *
   * @param {String} `key` The name of the stored date to get.
   * @return {Date} Returns the date object for `key`
   * @api public
   */

  get(key) {
    if (this.has(key)) {
      return (this.current = new Date(this.getRaw(key)));
    }
  }

  /**
   * Get the "raw" JSON-stringified date that was originally
   * stored for `key`, or undefined if a stored value does not exist.
   *
   * ```js
   * store.set('foo');
   * console.log(store.getRaw('foo'));
   * //=> Mon Apr 11 2016 08:39:10 GMT-0400 (EDT)
   *
   * console.log(store.getRaw('foo') instanceof Date);
   * //=> false
   *
   * console.log(store.get('foo') instanceof Date);
   * //=> true
   * ```
   *
   * @param {String} `key` The name of the stored date to get.
   * @return {String} Returns the stringified date for `key`
   * @api public
   */

  getRaw(key) {
    return this.dates[key];
  }

  /**
   * Get the numeric value corresponding to the time for stored date `key`,
   * according to universal time. See the MDN docs for [.getTime][get-time].
   *
   * ```js
   * store.set('foo');
   * console.log(store.getTime('foo'));
   * //=> 1460378350000
   * ```
   *
   * @param {String} `key` The name of the stored date to get.
   * @return {Number}
   * @api public
   */

  getTime(key) {
    return this.get(key).getTime();
  }

  /**
   * Return true if a date is stored for `key`, false if `undefined` or the
   * stored value is invalid.
   *
   * ```js
   * store.set('foo');
   * console.log(store.has('foo'));
   * //=> true
   * ```
   * @param {String} `key`
   * @return {Boolean}
   * @api public
   */

  has(key) {
    const date = this.dates[key];
    return date && new Date(date).toString() !== 'Invalid Date';
  }

  /**
   * Delete a date from the store.
   *
   * ```js
   * store.del('foo');
   * ```
   * @param {String|Array} `key` Property name or array of property names.
   * @return {Object} Returns the instance for chaining.
   * @api public
   */

  del(key) {
    delete this.dates[key];
    this.save();
    return this;
  }

  /**
   * Create a JavaScript date object from the given `str`. You may also supply
   * an optional offset to the starting date. offset defaults to the current
   * date and time. See [date.js][] for more details or to report date parsing
   * related issues.
   *
   * ```js
   * console.log(store.date('1 day from now'));
   * //=> Tue Apr 12 2016 10:05:12 GMT-0400 (EDT)
   * ```
   * @param {String} `str` A human-readable string to pass to [date.js][]
   * @return {Date} JavaScript Date object
   * @api public
   */

  date(...args) {
    return date(...args);
  }

  /**
   * Get the numeric value corresponding to the time for the date object returned
   * from the [.date](#date) method.
   *
   * ```js
   * console.log(store.date('1 day from now'));
   * //=> Tue Apr 12 2016 10:05:12 GMT-0400 (EDT)
   * ```
   * @param {String} `timespan` A human-readable string to pass to [date.js][]
   * @return {Date} JavaScript Date object
   * @api public
   */

  time(...args) {
    return this.date(...args).getTime();
  }

  /**
   * Returns the difference in seconds between stored date `key` and
   * the date returned from calling [date.js][] on the given `timespan`.
   *
   * ```js
   * console.log(store.diff('foo', '10 minutes ago'));
   * //=> 338563
   * ```
   * @param {String} `key` The stored date to compare
   * @param {String} `timespan` A human-readable string to pass to [date.js][]
   * @return {Number} The difference in seconds between the two dates, or `NaN` if invalid.
   * @api public
   */

  diff(key, timespan) {
    return this.getTime(key) - this.time(timespan);
  }

  /**
   * Calls [.getTime](#getTime) and adds the result to the `.current` property,
   * which is then used by other methods chained from `.lastSaved`.
   *
   * ```js
   * store.set('bar');
   * store.lastSaved('bar');
   * console.log(store.current);
   * //=> 1460378350000
   * console.log(store.lastSaved('bar').moreThan('31 minutes ago'));
   * //= false
   * console.log(store.lastSaved('bar').lessThan('31 minutes ago'));
   * //=> true
   * ```
   * @param {String} `key` The name of the stored date to set on `.current`
   * @return {Object} Returns the instance for chaining.
   * @api public
   */

  lastSaved(key) {
    this.current = this.getTime(key);
    return this;
  }

  /**
   * Calls [.time](#time) on the given `timespan`, and returns true if
   * the returned time is older than `this.current`. _This method must
   * be chained from [.lastSaved](#lastSaved)._
   *
   * ```js
   * store.set('bar');
   *
   * console.log(store.lastSaved('bar').moreThan('31 minutes ago'));
   * //= false
   * console.log(store.lastSaved('bar').lessThan('1 minutes ago'));
   * //=> true
   * ```
   * @param {String} `key` The name of the stored date to set on `.current`
   * @return {Object} Returns the instance for chaining.
   * @api public
   */

  moreThan(timespan) {
    return this.current && this.current < this.time(timespan);
  }

  isOlderThan(timespan) {
    return this.current && this.current <= this.time(timespan);
  }

  isNewerThan(timespan) {
    return this.current && this.current >= this.time(timespan);
  }

  /**
   * Calls `.time()` on the given `timespan`, and returns true if
   * the returned time is newer than `this.current`. _This method must
   * be chained from [.lastSaved](#lastSaved)._
   *
   * ```js
   * store.set('bar');
   *
   * console.log(store.lastSaved('bar').moreThan('31 minutes ago'));
   * //= false
   * console.log(store.lastSaved('bar').lessThan('1 minutes ago'));
   * //=> true
   * ```
   * @param {String} `key` The name of the stored date to set on `.current`
   * @return {Object} Returns the instance for chaining.
   * @api public
   */

  lessThan(timespan) {
    return this.current && this.current > this.time(timespan);
  }

  /**
   * Return an array of keys of items cached since the given `timespace`.
   *
   * ```js
   * var keys = store.filterSince('1 week ago');
   * ```
   * @param {String} `timespan` A human-readable string to pass to [date.js][]
   * @return {Array} Returns an array of keys
   * @api public
   */

  filterSince(timespan) {
    const time = this.time(timespan);
    const data = this.dates;
    const res = [];
    for (const key of Object.keys(data)) {
      if (time < new Date(data[key]).getTime()) {
        res.push(key);
      }
    }
    return res;
  }

  /**
   * Reset `store.dates` to an empty object.
   *
   * ```js
   * store.clear();
   * ```
   * @name .clear
   * @return {undefined}
   * @api public
   */

  clear() {
    this.dates = {};
    this.save();
  }

  /**
   * Stringify the store. Takes the same arguments as `JSON.stringify`.
   *
   * ```js
   * console.log(store.json(null, 2));
   * ```
   * @name .json
   * @return {string}
   * @api public
   */

  json(replacer = null, space = this.indent) {
    return JSON.stringify(this.dates, replacer, space);
  }

  /**
   * Calls [.writeFile()](#writefile) to persist the store to the file system,
   * after an optional [debounce](#options) period. This method should probably
   * not be called directly as it's used internally by other methods.
   *
   * ```js
   * store.save();
   * ```
   * @name .save
   * @return {undefined}
   * @api public
   */

  save() {
    if (!this.debounce) return this.writeFile();
    if (this.save.debounce) return;
    this.save.debounce = setTimeout(() => this.writeFile(), this.debounce);
  }

  /**
   * Immediately write the store to the file system. This method should probably
   * not be called directly. Unless you are familiar with the inner workings of
   * the code it's recommended that you use .save() instead.
   *
   * ```js
   * store.writeFile();
   * ```
   * @name .writeFile
   * @return {undefined}
   */

  writeFile() {
    if (this.save.debounce) {
      clearTimeout(this.save.debounce);
      this.save.debounce = null;
    }
    if (!this.saved) mkdir(path.dirname(this.path), this.options.mkdir);
    this.saved = true;
    fs.writeFileSync(this.path, this.json(), { mode: 0o0600 });
  }

  /**
   * Load the store.
   * @return {object}
   */

  load() {
    try {
      return (this._dates = JSON.parse(fs.readFileSync(this.path)));
    } catch (err) {
      if (err.code === 'EACCES') {
        err.message += '\ndate-store does not have permission to load this file\n';
        throw err;
      }
      if (err.code === 'ENOENT' || err.name === 'SyntaxError') {
        this._dates = {};
        return {};
      }
    }
  }

  /**
   * Getter/setter for the `store.dates` object, which holds the values
   * that are persisted to the file system.
   *
   * ```js
   * console.log(store.dates); //=> {}
   *
   * store.set('foo');
   * store.set('bar');
   *
   * console.log(store.dates);
   * // { foo: 'Mon Apr 11 2016 08:39:10 GMT-0400 (EDT)',
   * //   bar: 'Mon Apr 11 2016 08:39:10 GMT-0400 (EDT)' }
   * ```
   * @name .dates
   * @return {object}
   * @api public
   */

  set dates(val) {
    this._dates = val;
    this.save();
  }
  get dates() {
    return this._dates || (this._dates = this.load());
  }
}

/**
 * Create a directory and any intermediate directories that might exist.
 */

function mkdir(dirname, options = {}) {
  assert.equal(typeof dirname, 'string', 'expected dirname to be a string');
  const opts = Object.assign({ cwd: process.cwd(), fs }, options);
  const mode = opts.mode || 0o777 & ~process.umask();
  const segs = path.relative(opts.cwd, dirname).split(path.sep);
  const make = dir => fs.mkdirSync(dir, mode);
  for (let i = 0; i <= segs.length; i++) {
    try {
      make((dirname = path.join(opts.cwd, ...segs.slice(0, i))));
    } catch (err) {
      handleError(dirname, opts)(err);
    }
  }
  return dirname;
}

function handleError(dir, opts = {}) {
  return (err) => {
    if (err.code !== 'EEXIST' || path.dirname(dir) === dir || !opts.fs.statSync(dir).isDirectory()) {
      throw err;
    }
  };
}

/**
 * Expose `DateStore`
 */

module.exports = DateStore;
