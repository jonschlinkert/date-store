'use strict';

const utils = require('./utils');
const DateStore = require('./');
const dateStore = new DateStore('date-store-examples');

// dateStore.set('abc');
// dateStore.set('xyz');
// dateStore.set('xxx');

function isNewerThan(key, timespan) {
  return dateStore.lastSaved(key).moreThan(timespan);
}

// console.log(dateStore.get('xxx'))
// console.log(dateStore.isOlderThan('now'))
// console.log(dateStore.isOlderThan('10 minutes ago'))
// console.log(dateStore.isNewerThan('one week ago'))

console.log(dateStore.lastSaved('xxx').moreThan('310 minutes ago'));
console.log(dateStore.lastSaved('xxx').lessThan('2 hours ago'));
// // console.log(dateStore.time('45 years ago'));
// console.log(dateStore.diff('abc', '10 minutes ago'));
// console.log(dateStore.path);
// console.log(dateStore.cwd);
// console.log(dateStore.dates);
// console.log(dateStore.date('1 day from now'));
// //=> Tue Apr 12 2016 10:05:12 GMT-0400 (EDT)
// // console.log(utils.typeOf(dateStore.getRaw('abc')));
// // console.log(utils.typeOf(dateStore.get('abc')));
// // console.log(dateStore.get('abc') instanceof Date);
// console.log(dateStore.get('abc'));
// console.log(dateStore.getTime('abc'));
// console.log(dateStore.getTime(new Date()));

// console.log(dateStore.filterSince('1 minute ago'))
