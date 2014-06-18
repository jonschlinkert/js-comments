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


/**
 * ### parse(src, dest, options)
 *
 * **Usage**
 *
 * ```js
 * var comments = require('js-comments');
 * var docs = comments('lib/*.js');
 * ```
 * See [test/actual/comments.json](./test/actual/comments.json) for example output.
 * See [index.js](./index.js) for example comments.
 *
 * @param   {String}  `src` The source file path
 * @param   {String}  `dest` Optional destination file path for generating relative links.
 * @param   {Object}  `options`
 * @return  {String}
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
  var tmpl = options.template || path.join(__dirname, './lib/comment.tmpl.md');
  var json = comments(src, dest, options);
  if (options.json) {
    file.writeJSONSync(options.json, json);
  }

  var template = file.readFileSync(tmpl);
  var docs = _.template(template, {files: json});

  // Remove leading and trailing whitespace
  return docs.replace(/^\s+|\s+$/g, '');
};