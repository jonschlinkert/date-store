# date-store [![NPM version](https://img.shields.io/npm/v/date-store.svg?style=flat)](https://www.npmjs.com/package/date-store) [![NPM downloads](https://img.shields.io/npm/dm/date-store.svg?style=flat)](https://npmjs.org/package/date-store) [![Build Status](https://img.shields.io/travis/jonschlinkert/date-store.svg?style=flat)](https://travis-ci.org/jonschlinkert/date-store)

> Easily persist or get stored dates/times. Useful for conditionally making updates in an application based on the amount of time that has passed.

You might also be interested in [data-store](https://github.com/jonschlinkert/data-store).

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install date-store --save
```

## Usage

```js
var DateStore = require('date-store');
```

## API

### [DateStore](index.js#L24)

Create a new `DateStore` with the given `name` and `options`.

**Params**

* `name` **{String}**: If `options.path` is supplied, `name` will be ignored. Otherwise `name` is used as the filename for the JSON store: `~/.date-store/{name}.json`
* `options` **{Object}**: Optionally pass a `dir` and/or `path` to use for the JSON store. Default is `~/.date-store.json`

**Example**

```js
var dateStore = new DateStore();
```

### [.set](index.js#L50)

Store a `new Date()` for `key`.

**Params**

* `key` **{String}**
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
dateStore.set(key);
```

### [.get](index.js#L74)

Get the stored date object for `key`, or, if an instance of `Date` is passed, it will be returned directly.

**Params**

* `key` **{String}**: The name of the stored date to get.
* `returns` **{Date}**: Returns the date object for `key`

**Example**

```js
dateStore.set('foo');
console.log(dateStore.get('foo'));
//=> Mon Apr 11 2016 06:18:31 GMT-0400 (EDT)

console.log(dateStore.get('foo') instanceof Date);
//=> true
```

### [.getRaw](index.js#L101)

Get the "raw" JSON-stringified date that was originally stored for `key`.

**Params**

* `key` **{String}**: The name of the stored date to get.
* `returns` **{String}**: Returns the stringified date for `key`

**Example**

```js
dateStore.set('foo');
console.log(dateStore.getRaw('foo'));
//=> Mon Apr 11 2016 08:39:10 GMT-0400 (EDT)

console.log(dateStore.getRaw('foo') instanceof Date);
//=> false

console.log(dateStore.get('foo') instanceof Date);
//=> true
```

### [.getTime](index.js#L120)

Get the numeric value corresponding to the time for stored date `key`, according to universal time. See the MDN docs for [.getTime](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime).

**Params**

* `key` **{String}**: The name of the stored date to get.
* `returns` **{Number}**

**Example**

```js
dateStore.set('foo');
console.log(dateStore.getTime('foo'));
//=> 1460378350000
```

### [.date](index.js#L139)

Create a JavaScript date object from the given `str`. You may also supply an optional offset to the starting date. offset defaults to the current date and time. See [date.js](https://github.com/MatthewMueller/date) for more details or to report date parsing related issues.

**Params**

* `str` **{String}**: A human-readable string to pass to [date.js](https://github.com/MatthewMueller/date)
* `returns` **{Date}**: JavaScript Date object

**Example**

```js
console.log(dateStore.date('1 day from now'));
//=> Tue Apr 12 2016 10:05:12 GMT-0400 (EDT)
```

### [.time](index.js#L156)

Get the numeric value corresponding to the time for the date object returned from the [.date](#date) method.

**Params**

* `timespan` **{String}**: A human-readable string to pass to [date.js](https://github.com/MatthewMueller/date)
* `returns` **{Date}**: JavaScript Date object

**Example**

```js
console.log(dateStore.date('1 day from now'));
//=> Tue Apr 12 2016 10:05:12 GMT-0400 (EDT)
```

### [.diff](index.js#L174)

Returns the difference in seconds between stored date `key` and the date returned from calling [date.js](https://github.com/MatthewMueller/date) on the given `timespan`.

**Params**

* `key` **{String}**: The stored date to compare
* `timespan` **{String}**: A human-readable string to pass to [date.js](https://github.com/MatthewMueller/date)
* `returns` **{Number}**: The difference in seconds between the two dates, or `NaN` if invalid.

**Example**

```js
console.log(dateStore.diff('foo', '10 minutes ago'));
//=> 338563
```

### [.lastSaved](index.js#L197)

Calls [.getTime](#getTime) and adds the result to a `._time` property, which is then used by other methods chained from `.lastSaved`.

**Params**

* `key` **{String}**: The name of the stored date to set on `._time`
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
dateStore.set('bar');
dateStore.lastSaved('bar');
console.log(dateStore._time);
//=> 1460378350000
console.log(dateStore.lastSaved('bar').moreThan('31 minutes ago'));
//= false
console.log(dateStore.lastSaved('bar').lessThan('31 minutes ago'));
//=> true
```

### [.moreThan](index.js#L220)

Calls [.time](#time) on the given `timespan`, and returns true if the returned time is older than `this._time`. _This method must be chained from [.lastSaved](#lastSaved)._

**Params**

* `key` **{String}**: The name of the stored date to set on `._time`
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
dateStore.set('bar');

console.log(dateStore.lastSaved('bar').moreThan('31 minutes ago'));
//= false
console.log(dateStore.lastSaved('bar').lessThan('1 minutes ago'));
//=> true
```

### [.lessThan](index.js#L242)

Calls `.time()` on the given `timespan`, and returns true if the returned time is newer than `this._time`. _This method must be chained from [.lastSaved](#lastSaved)._

**Params**

* `key` **{String}**: The name of the stored date to set on `._time`
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
dateStore.set('bar');

console.log(dateStore.lastSaved('bar').moreThan('31 minutes ago'));
//= false
console.log(dateStore.lastSaved('bar').lessThan('1 minutes ago'));
//=> true
```

### [.filterSince](index.js#L257)

Return an array of keys of items cached since the given `timespace`.

**Params**

* `timespan` **{String}**: A human-readable string to pass to [date.js](https://github.com/MatthewMueller/date)
* `returns` **{Array}**: Returns an array of keys

**Example**

```js
var keys = dateStore.filterSince('1 week ago');
```

### [.has](index.js#L282)

Return true if a date is stored for `key`, false if `undefined`.

**Params**

* `key` **{String}**
* `returns` **{Boolean}**

**Example**

```js
dateStore.set('foo');
console.log(dateStore.has('foo'));
//=> true
```

### [.del](index.js#L297)

Delete a date from the store.

**Params**

* `key` **{String|Array}**: Property name or array of property names.
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
dateStore.del('foo');
```

### [.save](index.js#L312)

Persist the `dateStore.dates` cache to a JSON file at the currently defined [.path](#path).

**Example**

```js
dateStore.save();
```

### [.dir](index.js#L328)

Get or set the directory to use for the date store. Default is user home. Report any OS-related user-home issues to [os-homedir][].

**Example**

```js
console.log(dateStore.dir);
//=> 'Users/jonschlinkert'
```

### [.path](index.js#L344)

Get or set the absolute path to use for the date store. Default is `dateStore.dir + '/.date-store.json'`.

**Example**

```js
console.log(dateStore.path);
//=> 'Users/jonschlinkert/.date-store.json'
```

### [.dates](index.js#L371)

When an instance of `DateStore` is created, if a store exists at the currently defined [.path](#path), the `.dates` cache is primed with the object created by calling `JSON.parse` on the contents of that file. Otherwise an empty object is used.

**Example**

```js
console.log(dateStore.dates);
//=> {}

datesStore.set('foo');
datesStore.set('bar');

console.log(dateStore.dates);
// { foo: 'Mon Apr 11 2016 08:39:10 GMT-0400 (EDT)',
//   bar: 'Mon Apr 11 2016 08:39:10 GMT-0400 (EDT)' }
```

## Related projects

You might also be interested in these projects:

* [data-store](https://www.npmjs.com/package/data-store): Easily get, set and persist config data. | [homepage](https://github.com/jonschlinkert/data-store)
* [nanoseconds](https://www.npmjs.com/package/nanoseconds): Convert the process.hrtime array to a single nanoseconds value. | [homepage](https://github.com/jonschlinkert/nanoseconds)
* [time-stamp](https://www.npmjs.com/package/time-stamp): Get a formatted timestamp. | [homepage](https://github.com/jonschlinkert/time-stamp)

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/jonschlinkert/date-store/issues/new).

## Building docs

Generate readme and API documentation with [verb][]:

```sh
$ npm install verb && npm run docs
```

Or, if [verb][] is installed globally:

```sh
$ verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](https://github.com/jonschlinkert/date-store/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on April 21, 2016._

[object Object]
[os-homedir]: https://github.com/sindresorhus/os-homedir
[verb]: https://github.com/verbose/verb