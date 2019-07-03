'use strict';

require('mocha');
const assert = require('assert');
const DateStore = require('./');
let store;

describe('date-store', () => {
  beforeEach(() => {
    store = new DateStore({ path: __dirname + '/fixtures/.test.json' });
  });

  describe('API', () => {
    it('should export a function', () => {
      assert.equal(typeof DateStore, 'function');
    });

    it('should expose methods', () => {
      assert.equal(typeof store.set, 'function');
      assert.equal(typeof store.get, 'function');
      assert.equal(typeof store.has, 'function');
      assert.equal(typeof store.del, 'function');
    });
  });

  describe('.set', () => {
    it('should set a date on the store', () => {
      store.set('foo');
      assert(store.dates.hasOwnProperty('foo'));
      store.del('foo');
    });
  });

  describe('.get', () => {
    it('should get a date from the store', () => {
      store.set('foo');
      assert.equal(store.get('foo') instanceof Date, true);
      store.del('foo');
    });
  });

  describe('.getRaw', () => {
    it('should get a "raw" date string from the store', () => {
      store.set('foo');
      assert.equal(typeof store.getRaw('foo'), 'string');
      store.del('foo');
    });
  });

  describe('.has', () => {
    it('should return true if the store has the given key', () => {
      store.set('foo');
      assert(store.has('foo'));
      store.del('foo');
    });

    it('should return false if the store does not have the given key', () => {
      assert(!store.has('a'));
      assert(!store.has('b'));
      assert(!store.has('c'));
    });
  });

  describe('.del', () => {
    it('should delete a property from the store', () => {
      store.set('foo');
      assert(store.has('foo'));
      store.del('foo');
      assert(!store.has('foo'));
    });
  });
});
