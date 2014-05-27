/**
 * parse-comments <https://github.com/assemble/parse-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT license.
 */

const file = require('fs-utils');
const path = require('path');
const relative = require('relative');
const parseComments = require('./parse');
const stripBanner = require('strip-banner');
const _ = require('lodash');

const format = require('./format');
const condense = require('./condense');
const tmpl = 'lib/comment.tmpl.md';



function lineCount(content) {
  if (_.isEmpty(content)) {
    return 0;
  }
  content = file.normalizeNL(content);
  return content.split('\n').length;
}


var comments = function(src, dest, options) {
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

    var comments = parseComments(content);

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


module.exports = comments;