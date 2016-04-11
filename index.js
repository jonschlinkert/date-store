/*!
 * date-store (https://github.com/jonschlinkert/date-store)
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('date-store');

module.exports = function(config) {
  return function(app) {
    if (this.isRegistered('date-store')) return;

    this.define('store', function() {
      debug('running store');
      
    });
  };
};
