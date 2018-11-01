'use strict';

const browsers = [
  'last 1 Chrome versions',
  'last 1 Firefox versions',
  'last 1 Safari versions'
];

if (process.env.INCLUDE_IE) {
  browsers.push('ie 11');
}

module.exports = {
  browsers
};
