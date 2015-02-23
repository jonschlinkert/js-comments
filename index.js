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

var _ = require('lodash');
var comments = require('./lib');
var helpers = require('lodash-helpers');

/**
 * Default readme template
 *
 * @type {String}
 */

var defaultTemplate = require('js-comments-template').readme;

/**
 * ```js
 * var comments = require('js-comments');
 * var docs = comments(string);
 * ```
 * See [example output](./test/actual/comments.json).
 * See [example code comments](./index.js).
 *
 *
 * @param {String} `patterns` Glob pattern or file paths to use.
 * @param {String} `dest` Optional destination file path for generating relative links.
 * @param {Object} `options`
 * @return  {String} String of rendered markdown documentation.
 * @api public
 */

function jsc(patterns, dest, opts) {
  var files = jsc.parseFiles(patterns, dest, opts);
  return jsc.render(files, opts);
}

/**
 * Expands the given glob `patterns` and creates a normalized
 * `comments` object for each file in the array.
 *
 * @param {String} `patterns` Glob pattern or file paths to use.
 * @param {String} `dest` Optional destination file path for generating relative links.
 * @param {Object} `options`
 * @return {Array} Returns an array of comments objects.
 * @api public
 */

jsc.parseFiles = function (patterns, dest, opts) {
  if (typeof patterns === 'object') {
    opts = patterns;
    dest = opts.dest;
    patterns = opts.src;
  }

  if (typeof dest === 'object') {
    opts = dest;
    dest = null;
  }

  var opts = opts || {};

  dest = dest || opts.dest || process.cwd();
  return comments.parseFiles(patterns, dest, opts);
};

/**
 * Render a template string with the given `context`. A
 * custom lodash template may be passed on the options.
 *
 * @param  {Object} `context`
 * @param  {Object} `options`
 * @return {String} Return the rendered string.
 * @api public
 */

jsc.render = function (files, options) {
  var opts = _.extend({template: defaultTemplate}, options);
  opts.helpers = opts.helpers || _.pick(opts, _.methods(opts));

  var ctx = _.defaults({files: files}, opts, opts.data);
  var str = _.template(opts.template, {imports: _.extend(helpers, opts.helpers)})(ctx);

  str = str.split('\r').join('').replace(/\n{3,}/g, '\n\n');
  var re = /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)([\s\S]+?)\n/gm;
  var match;

  while(match = re.exec(str)) {
    str = str.replace(match[2], function (_, a, b) {
      return _ + '\n';
    });
  }

  return str.replace(/^\s+|\s+$/g, '');
};

/**
 * Export `jsc`
 */

module.exports = jsc;
