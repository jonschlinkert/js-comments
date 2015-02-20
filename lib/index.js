/*!
 * js-comments <https://github.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var glob = require('globby');
var relative = require('relative');
var repeat = require('repeat-string');
var parseComments = require('parse-comments');
var tmpl = require('js-comments-template');
var _ = require('lodash');

/**
 * Local dependencies
 */

var condense = require('./condense');
var format = require('./format');

/**
 * Export `comments`
 */

var comments = module.exports;

/**
 * Filter and normalize the given `comments` object.
 *
 * @param  {Object} `comments`
 * @return {Object} Normalized comments object.
 */

comments.filter = function (obj, options) {
  var opts = _.extend({}, options);

  return obj.filter(function (o, i) {
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

    if (o.section === true) {
      o.heading.level = 1;
      return true;
    }

    if (o.api && o.api === 'public') {
      return true
    } else {
      return false;
    }
  }).map(function (o) {

    // If the user explicitly defines a `@type`,
    // use that instead of the code context type
    if (o && o.type) {
      o.type = o.type;
    }


    if (o.doc) {
      o.doc = '{%= docs("' + o.doc + '") %}';
      o.description = o.doc + '\n\n' + o.description;
    }

    o.line = o.end ? (o.end + 2) : o.begin;

    var heading = o.heading || {};
    var lvl = heading.level || 2;

    if (o.name) {
      heading.text = o.name;
    }

    if (!o.section) {
      lvl = heading.lvl || 2;
    }

    var text = heading.text;
    var prefix = repeat('#', lvl);

    o.prefix = prefix;
    o.lvl = lvl;

    if (text) {
      if (heading.prefix) {
        text = heading.prefix + text;
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

comments.process = function (template, comments, options) {
  var opts = _.extend({}, options);

  var result = _.template(template || tmpl, {
    imports: repeat
  }, comments);

  if (opts.format) {
    return format(condense(result));
  }

  return result;
};

comments.parseFile = function (filepath, dest, options) {
  // Read the file
  var str = fs.readFileSync(filepath, 'utf8');

  // Parse the string
  var context = comments.parse(str, options);
  var o = {};

  // Build up path and file name properties
  o.name = path.basename(filepath);
  if (dest.indexOf('://') === -1) {
    o.path = relative(dest, filepath);
  } else {
    o.path = dest + '/' + filepath;
  }

  // Push comments into an array
  o.comments = [];
  o.comments = o.comments.concat(context);
  return o;
};


comments.parseFiles = function (patterns, dest, options) {
  if (typeof dest === 'object' || typeof dest === 'undefined') {
    options = dest;
    dest = null;
  }

  var opts = _.extend({stripBanner: true}, options);
  opts.cwd = opts.cwd || process.cwd();

  dest = dest || opts.dest;
  if (!dest) {
    var msg = '.expand() expects `dest` or `options.dest` to be defined, ' +
      'to enable creating relative paths to referenced files.'
    throw new Error(msg);
  }

  var o = {}, arr = [];

  var arr = glob.sync(patterns, opts).map(function (filepath) {
    var name = path.basename(filepath, path.extname(filepath));
    o[name] = comments.parseFile(filepath, dest);
    arr.push(o[name]);
  });

  if (opts.array) {
    return arr;
  }
  return o;
};


