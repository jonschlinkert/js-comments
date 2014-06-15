/*!
 * js-comments <https://github.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT License (MIT)
 */

'use strict';

var _ = require('lodash');

/**
 * Replace extraneous newlines with a single newline.
 *
 * @title compact
 * @param  {String} str
 *
 * @return {String}
 * @api public
 */

module.exports = function (str, sep) {
  sep = sep || '\n';
  str = (str || '\n\n').replace(/[\r\n]+/g, '\n');
  return _.compact(str.split(sep).map(function(line) {
    return line.trim();
  })).join(sep);
};