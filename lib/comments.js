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
    page[name] = {};
    page[name].name = file.basename(name);
    page[name].path = file.normalizeSlash(relpath);
    page[name].comments = [];

    // Allow passing a filtering function as a second param.
    var parsed = parseComments(content, opts.fn);
    var printable = parsed.comments.filter(function (comment) {
      if (comment.string && /^\/\*{1,2}\!/.test(comment.string)) {
        return false;
      }
      if (comment.type === 'property') {
        return false;
      }
      return true;
    }).map(function (comment) {
      var o = {};
      comment = _.merge({}, comment.comment, comment);
      comment.line = comment.end ? (comment.end + 2) : comment.begin;
      delete comment.comment;

      var heading = comment.heading || {};
      var lvl = heading.level || 2;

      if (comment.name) {
        heading.text = comment.name;
        lvl = heading.lvl || 2;
      }

      var text = heading.text;
      var prefix = repeat('#', lvl);

      if (text) {
        if (comment.type === 'method') {
          text = '.' + text;
        }
        comment.title = prefix + ' ' + text;
      }
      return comment;
    });
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


