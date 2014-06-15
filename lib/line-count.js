/*!
 * js-comments <https://github.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT License (MIT)
 */

'use strict';

var _ = require('lodash');

module.exports = function(content) {
  if (_.isEmpty(content)) {
    return 0;
  }
  content = content.replace(/[\r]/g, '');
  return content.split('\n').length;
};