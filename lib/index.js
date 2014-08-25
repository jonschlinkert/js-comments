/*!
 * js-comments <https://github.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT License (MIT)
 */

'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var file = require('fs-utils');
var path = require('path');
var glob = require('globby');
var relative = require('relative');
var repeat = require('repeat-string');
var tmpl = require('js-comments-template');
var parseComments = require('parse-comments');
var _ = require('lodash');

var format = require('./format');
var condense = require('./condense');

/**
 * Export `comments`
 */

var comments = module.exports;


comments.expand = function (patterns, dest, options) {
  if (typeof dest === 'object' || typeof dest === 'undefined') {
    options = dest;
    dest = null;
  }

  var opts = _.extend({stripBanner: true}, options);
  opts.cwd = opts.cwd || process.cwd();

  dest = dest || opts.dest;
  if (!dest) {
    throw new Error('.expand() expects `dest` or `options.dest` to be defined.');
  }

  var page = {};

  glob.sync(patterns, opts).forEach(function (filepath) {
    var name = path.basename(filepath, path.extname(filepath));
    // Read the file
    var str = fs.readFileSync(filepath, 'utf8');

    // Build up path and file name properties
    page[name] = {};
    page[name].name = path.basename(filepath);
    page[name].path = relative(dest, filepath);

    // Parse the string
    var context = comments.parse(str);

    page[name].comments = [];
    page[name].comments.push(context);
  });

  return page;
};


/**
 * Filter and normalize the given `comments` object.
 *
 * @param  {Object} `comments`
 * @return {Object} Normalized comments object.
 */

comments.filter = function (comments, options) {
  var opts = _.extend({}, options);

  return comments.filter(function (o, i) {
    o = _.extend({}, o);

    if (o.string && /^.{1,8}!/.test(o.string)) {
      return false;
    }

    if (opts.stripBanner && i === 0) {
      return false;
    }

    if (o.type === 'property') {
      return false;
    }

    return true;
  }).map(function (o) {

    // If the user explicitly defines a `@type`,
    // use that instead of the code context type
    if (o && o.type) {
      o.type = o.type;
    }

    o.line = o.end ? (o.end + 2) : o.begin;

    var heading = o.heading || {};
    var lvl = heading.level || 2;

    if (o.name) {
      heading.text = o.name;
      lvl = heading.lvl || 2;
    }

    var text = heading.text;
    var prefix = repeat('#', lvl);

    o.prefix = prefix;
    o.lvl = lvl;

    if (text) {
      if (o.type === 'method' || /method/.test(o.type)) {
        text = '.' + text;
      }
      o.prefixed = prefix + ' ' + text;
      o.title = text;
    }

    return o;
  });
};


/**
 * Parse comments from the given `str`.
 *
 * @param  {String} `str` The string to parse.
 * @return  {Object} Object of comments.
 */

comments.parse = function (str, options) {
  var ctx = parseComments(str, options);
  return comments.filter(ctx, options);
};


/**
 * Process the given Lo-dash `template` string, passing a
 * `comments` object as context.
 *
 * @param  {String} `template` The lo-dash template to use.
 * @param  {Object} `comments` Object of comments.
 * @return {String}
 */

comments.process = function (template, comments) {
  var result = _.template(template || tmpl, comments, {
    imports: repeat
  });
  return format(condense(result));
};