/*!
 * js-comments <https://github.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';


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
  str = str.replace(/\r/g, '');
  sep = sep || '\n';

  str = (str || '\n\n').replace(/\n\n+/g, '\n\n');
  return str.split(sep).map(function(line) {
    return line.trim();
  }).filter(Boolean).join(sep);
};