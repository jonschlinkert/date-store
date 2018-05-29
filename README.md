# date-store [![NPM version](https://img.shields.io/npm/v/date-store.svg?style=flat)](https://www.npmjs.com/package/date-store) [![NPM monthly downloads](https://img.shields.io/npm/dm/date-store.svg?style=flat)](https://npmjs.org/package/date-store) [![NPM total downloads](https://img.shields.io/npm/dt/date-store.svg?style=flat)](https://npmjs.org/package/date-store) [![Linux Build Status](https://img.shields.io/travis/jonschlinkert/date-store.svg?style=flat&label=Travis)](https://travis-ci.org/jonschlinkert/date-store)

> Easily persist or get stored dates/times. Useful for conditionally making updates in an application based on the amount of time that has passed.

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save date-store
```

## Usage

```js
const DateStore = require('date-store');
```

## API

**Params**

* `name` **{String}**: If `options.path` is supplied, `name` will be ignored. Otherwise `name` is used as the filename for the JSON store: `~/.date-store/{name}.json`
* `options` **{Object}**: Optionally pass a `dir` and/or `path` to use for the JSON store. Default is `~/.date-store.json`

**Example**

```js
const store = new DateStore();
```

**Params**

* `key` **{string}**
* `returns` **{object}**: Returns the instance for chaining.

**Example**

```js
store.set(key);
```

**Params**

* `key` **{String}**: The name of the stored date to get.
* `returns` **{Date}**: Returns the date object for `key`

**Example**

```js
store.set('foo');
console.log(store.get('foo'));
//=> Mon Apr 11 2016 06:18:31 GMT-0400 (EDT)

console.log(store.get('foo') instanceof Date);
//=> true
```

**Params**

* `key` **{String}**: The name of the stored date to get.
* `returns` **{String}**: Returns the stringified date for `key`

**Example**

```js
store.set('foo');
console.log(store.getRaw('foo'));
//=> Mon Apr 11 2016 08:39:10 GMT-0400 (EDT)

console.log(store.getRaw('foo') instanceof Date);
//=> false

console.log(store.get('foo') instanceof Date);
//=> true
```

**Params**

* `key` **{String}**: The name of the stored date to get.
* `returns` **{Number}**

**Example**

```js
store.set('foo');
console.log(store.getTime('foo'));
//=> 1460378350000
```

**Params**

* `key` **{String}**
* `returns` **{Boolean}**

**Example**

```js
store.set('foo');
console.log(store.has('foo'));
//=> true
```

**Params**

* `key` **{String|Array}**: Property name or array of property names.
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
store.del('foo');
```

**Params**

* `str` **{String}**: A human-readable string to pass to [date.js](https://github.com/MatthewMueller/date)
* `returns` **{Date}**: JavaScript Date object

**Example**

```js
console.log(store.date('1 day from now'));
//=> Tue Apr 12 2016 10:05:12 GMT-0400 (EDT)
```

**Params**

* `timespan` **{String}**: A human-readable string to pass to [date.js](https://github.com/MatthewMueller/date)
* `returns` **{Date}**: JavaScript Date object

**Example**

```js
console.log(store.date('1 day from now'));
//=> Tue Apr 12 2016 10:05:12 GMT-0400 (EDT)
```

**Params**

* `key` **{String}**: The stored date to compare
* `timespan` **{String}**: A human-readable string to pass to [date.js](https://github.com/MatthewMueller/date)
* `returns` **{Number}**: The difference in seconds between the two dates, or `NaN` if invalid.

**Example**

```js
console.log(store.diff('foo', '10 minutes ago'));
//=> 338563
```

**Params**

* `key` **{String}**: The name of the stored date to set on `.current`
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
store.set('bar');
store.lastSaved('bar');
console.log(store.current);
//=> 1460378350000
console.log(store.lastSaved('bar').moreThan('31 minutes ago'));
//= false
console.log(store.lastSaved('bar').lessThan('31 minutes ago'));
//=> true
```

**Params**

* `key` **{String}**: The name of the stored date to set on `.current`
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
store.set('bar');

console.log(store.lastSaved('bar').moreThan('31 minutes ago'));
//= false
console.log(store.lastSaved('bar').lessThan('1 minutes ago'));
//=> true
```

**Params**

* `key` **{String}**: The name of the stored date to set on `.current`
* `returns` **{Object}**: Returns the instance for chaining.

**Example**

```js
store.set('bar');

console.log(store.lastSaved('bar').moreThan('31 minutes ago'));
//= false
console.log(store.lastSaved('bar').lessThan('1 minutes ago'));
//=> true
```

**Params**

* `timespan` **{String}**: A human-readable string to pass to [date.js](https://github.com/MatthewMueller/date)
* `returns` **{Array}**: Returns an array of keys

**Example**

```js
var keys = store.filterSince('1 week ago');
```

### [.clear](index.js#L323)

Reset `store.dates` to an empty object.

* `returns` **{undefined}**

**Example**

```js
store.clear();
```

### [.json](index.js#L339)

Stringify the store. Takes the same arguments as `JSON.stringify`.

* `returns` **{string}**

**Example**

```js
console.log(store.json(null, 2));
```

### [.save](index.js#L358)

Calls [.writeFile()](#writefile) to persist the store to the file system, after an optional [debounce](#options) period. This method should probably not be called directly as it's used internally by other methods.

* `returns` **{undefined}**

**Example**

```js
store.save();
```

### [.dates](index.js#L425)

Getter/setter for the `store.dates` object, which holds the values that are persisted to the file system.

* `returns` **{object}**

**Example**

```js
console.log(store.dates); //=> {}

store.set('foo');
store.set('bar');

console.log(store.dates);
// { foo: 'Mon Apr 11 2016 08:39:10 GMT-0400 (EDT)',
//   bar: 'Mon Apr 11 2016 08:39:10 GMT-0400 (EDT)' }
```

## About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

</details>

<details>
<summary><strong>Running Tests</strong></summary>

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

</details>

<details>
<summary><strong>Building docs</strong></summary>

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

</details>

### Related projects

You might also be interested in these projects:

* [data-store](https://www.npmjs.com/package/data-store): Easily persist and load config data. No dependencies. | [homepage](https://github.com/jonschlinkert/data-store "Easily persist and load config data. No dependencies.")
* [nanoseconds](https://www.npmjs.com/package/nanoseconds): Convert the process.hrtime() array to a single nanoseconds value. This makes it easier to diff… [more](https://github.com/jonschlinkert/nanoseconds) | [homepage](https://github.com/jonschlinkert/nanoseconds "Convert the process.hrtime() array to a single nanoseconds value. This makes it easier to diff times.")
* [time-stamp](https://www.npmjs.com/package/time-stamp): Get a formatted timestamp. | [homepage](https://github.com/jonschlinkert/time-stamp "Get a formatted timestamp.")

### Author

**Jon Schlinkert**

* [LinkedIn Profile](https://linkedin.com/in/jonschlinkert)
* [GitHub Profile](https://github.com/jonschlinkert)
* [Twitter Profile](https://twitter.com/jonschlinkert)

### License

Copyright © 2018, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.6.0, on May 29, 2018._