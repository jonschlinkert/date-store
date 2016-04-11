'use strict';

require('mocha');
var assert = require('assert');
var DateStore = require('./');
var dateStore;

describe('date-store', function() {
  beforeEach(function() {
    dateStore = new DateStore({path: __dirname + '/fixtures/.test.json'});
  });

  describe('API', function() {
    it('should export a function', function() {
      assert.equal(typeof DateStore, 'function');
    });

    it('should expose methods', function() {
      assert.equal(typeof dateStore.set, 'function');
      assert.equal(typeof dateStore.get, 'function');
      assert.equal(typeof dateStore.has, 'function');
      assert.equal(typeof dateStore.del, 'function');
    });
  });

  describe('.set', function() {
    it('should set a date on the store', function() {
      dateStore.set('foo');
      assert(dateStore.dates.hasOwnProperty('foo'));
      assert.equal(typeof dateStore.dates.foo, 'string');
      dateStore.del('foo');
    });
  });

  describe('.get', function() {
    it('should get a date from the store', function() {
      dateStore.set('foo');
      assert.equal(dateStore.get('foo') instanceof Date, true);
      dateStore.del('foo');
    });
  });

  describe('.getRaw', function() {
    it('should get a "raw" date string from the store', function() {
      dateStore.set('foo');
      assert.equal(typeof dateStore.getRaw('foo'), 'string');
      dateStore.del('foo');
    });
  });

  describe('.has', function() {
    it('should return true if the store has the given key', function() {
      dateStore.set('foo');
      assert(dateStore.has('foo'));
      dateStore.del('foo');
    });

    it('should return false if the store does not have the given key', function() {
      assert(!dateStore.has('a'));
      assert(!dateStore.has('b'));
      assert(!dateStore.has('c'));
    });
  });

  describe('.del', function() {
    it('should delete a property from the store', function() {
      dateStore.set('foo');
      assert(dateStore.has('foo'));
      dateStore.del('foo');
      assert(!dateStore.has('foo'));
    });
  });
});
