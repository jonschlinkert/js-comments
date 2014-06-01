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
var headings = require('./lib/headings');
var _ = require('lodash');



/**
 * ### parse( src, dest, options )
 *
 * **Usage**
 *
 * ```js
 * var comments = require('js-comments');
 * var output = comments('lib/*.js');
 * ```
 * See [test/actual/comments.md](./test/actual/comments.md) for example output.
 * See [index.js](./index.js) for example comments.
 *
 * @param   {String}  `src` The source file path
 * @param   {String}  `dest` Optional destination file path, not for output but for generating relative links.
 * @param   {Object}  `options`
 * @return  {String}
 */

module.exports = function(src, dest, options) {
  if (typeof src === 'object') {
    options = src;
    dest = options.dest;
    src = options.src;
  }

  options = options || {};

  // The lodash template to use for comments
  var tmpl = options.template || path.join(__dirname, './lib/comment.tmpl.md');
  var json = comments(src, dest);
  if (options.json) {
    file.writeJSONSync(options.json, json);
  }

  var template = file.readFileSync(tmpl);
  var docs = _.template(template, {files: json});

  // Clean up whitespace
  docs = docs.replace(/^\s+|\s+$/g, '');

  // Adjust toc
  return headings(docs, options.toc);
};

