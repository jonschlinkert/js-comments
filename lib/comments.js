/*!
 * js-comments <https://github.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT License (MIT)
 */

'use strict';

var file = require('fs-utils');
var path = require('path');
var relative = require('relative');
var stripBanner = require('strip-banner');
var _ = require('lodash');

var format = require('./format');
var parseComments = require('./parse');
var lineCount = require('./line-count');
var condense = require('./condense');
var tmpl = 'lib/comment.tmpl.md';


var comments = module.exports = function comments(src, dest, options) {
  options = options || {};
  tmpl = options.tmpl || tmpl;
  var page = {};

  file.expand(src, {filter: 'isFile'}).map(function(filepath) {
    filepath = path.resolve(filepath);
    var name = file.filename(filepath);
    var relpath = relative(dest, filepath);

    // Read file
    var content = file.readFileSync(filepath, options);
    var origLen = lineCount(content);

    // Strip banners so they don't end up in docs
    content = stripBanner(content);
    var stripLen = lineCount(content);
    var offset = origLen - stripLen;

    page[name] = {};
    page[name].name = file.basename(name);
    page[name].path = file.normalizeSlash(relpath);
    page[name].comments = [];

    // Allow passing a filtering function as a second param.
    var comments = parseComments(content, options.fn);

    page[name].comments.push(comments.map(function (comment) {
      comment.line = comment.line + offset;
      return comment;
    }));
  });

  return page;
};

comments.process = function(obj) {
  var result = _.template(tmpl, obj);
  return format(condense(result));
};


