/*!
 * js-comments <https://github.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT License (MIT)
 */

'use strict';

var path = require('path');
var file = require('fs-utils');
var comments = require('./lib/comments');
var _ = require('lodash');

// Default readme template
var defaultTemplate = require('js-comments-template').docs;


/**
 * ```js
 * var comments = require('js-comments');
 * var docs = comments(string);
 * ```
 * See [example output](./test/actual/comments.json).
 * See [example code comments](./index.js).
 *
 * @param   {String} `str` The source string.
 * @param   {String} `dest` Optional destination file path for generating relative links.
 * @param   {Object} `options`
 * @return  {String} Rendered documentation.
 */

module.exports = function(src, dest, options) {
  if (typeof src === 'object') {
    options = src;
    dest = options.dest;
    src = options.src;
  }
  if (typeof dest === 'object') {
    options = dest;
    dest = process.cwd();
  }

  options = options || {};
  dest = options.dest || process.cwd();

  // The lodash template to use for comments
  var template = options.template || defaultTemplate;
  var json = comments(src, dest, options);
  if (options.json) {
    file.writeJSONSync(options.json, json);
  }

  var docs = _.template(template, {files: json});

  // Remove leading and trailing whitespace
  return docs.replace(/^\s+|\s+$/g, '');
};