/*!
 * js-comments <https://github.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT License (MIT)
 */
'use strict';

var utils = module.exports = {};

utils.trimRight = function(str) {
  return str.replace(/\s+$/, '');
};

utils.countNewLines = function (str) {
  var count = 0;
  for (var i = 0; i < str.length; i++) {
    if (str[i] === '\n') {
      count++;
    }
  }
  return count;
};

utils.stripStars = function (line) {
  return utils.trimRight(line.replace(/^\s*\*?\s?/, ''));
};

utils.parseParams = function(param) {
  var re = /(?:^\{([^\}]+)\}\s+)?(?:([\S]+)\s*)?([\s\S]*)?/;
  var match = param.match(re);
  return {
    type: match[1],
    name: match[2],
    description: (match[3] || '').replace(/^\s*-\s*/, '')
  };
};

