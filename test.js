'use strict';

require('mocha');
const assert = require('assert');
const DateStore = require('./');
let store;

describe('date-store', function() {
  beforeEach(function() {
    store = new DateStore({ path: __dirname + '/fixtures/.test.json' });
  });

  describe('API', function() {
    it('should export a function', function() {
      assert.equal(typeof DateStore, 'function');
    });

    it('should expose methods', function() {
      assert.equal(typeof store.set, 'function');
      assert.equal(typeof store.get, 'function');
      assert.equal(typeof store.has, 'function');
      assert.equal(typeof store.del, 'function');
    });
  });

  describe('.set', function() {
    it('should set a date on the store', function() {
      store.set('foo');
      assert(store.dates.hasOwnProperty('foo'));
      store.del('foo');
    });
  });

  describe('.get', function() {
    it('should get a date from the store', function() {
      store.set('foo');
      assert.equal(store.get('foo') instanceof Date, true);
      store.del('foo');
    });
  });

  describe('.getRaw', function() {
    it('should get a "raw" date string from the store', function() {
      store.set('foo');
      assert.equal(typeof store.getRaw('foo'), 'string');
      store.del('foo');
    });
  });

  describe('.has', function() {
    it('should return true if the store has the given key', function() {
      store.set('foo');
      assert(store.has('foo'));
      store.del('foo');
    });

    it('should return false if the store does not have the given key', function() {
      assert(!store.has('a'));
      assert(!store.has('b'));
      assert(!store.has('c'));
    });
  });

  describe('.del', function() {
    it('should delete a property from the store', function() {
      store.set('foo');
      assert(store.has('foo'));
      store.del('foo');
      assert(!store.has('foo'));
    });
  });
});
