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
var repeat = require('repeat-string');
var stripBanner = require('strip-banner');
var tmpl = require('js-comments-template');
var parseComments = require('parse-comments');
var lineCount = require('count-lines');
var _ = require('lodash');

var format = require('./format');
var condense = require('./condense');


var comments = module.exports = function comments(src, dest, options) {
  var opts = _.extend({}, options);
  tmpl = opts.tmpl || tmpl;
  var page = {};

  file.expand(src, {filter: 'isFile'}).map(function(filepath) {
    filepath = path.resolve(filepath);

    var name = file.filename(filepath);
    var relpath = relative(dest, filepath);

    // Read file
    var content = file.readFileSync(filepath, opts);
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
    var parsed = parseComments(content, opts.fn);
    var printable = parsed.comments.map(function (comment) {
      comment = _.extend(comment, comment.comment);
      comment.line = comment.line + offset;
      delete comment.comment;
      if (comment.heading && comment.heading.level) {
        var level = comment.heading.level + (opts.level || 0);
        var prefix = repeat('#', level);
        comment.title = prefix + ' ' + comment.heading.text;
      }
      console.log(comment)
      return comment;
    })
    page[name].comments.push(printable);
  });

  return page;
};

comments.process = function(obj) {
  var helpers = {};
  helpers.repeat = repeat;
  var settings = {imports: repeat};
  var result = _.template(tmpl, obj, settings);
  return format(condense(result));
};


