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
var path = require('path');
var comments = require('./lib');


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
 * @param {String} `patterns` Glob pattern or file paths to use.
 * @param {String} `dest` Optional destination file path for generating relative links.
 * @param {Object} `options`
 * @return  {String} String of rendered markdown documentation.
 */

var jscomments = function(patterns, dest, options) {
  var files = jscomments.expandFiles(patterns, dest, options);
  return jscomments.render(files, options);
};


/**
 * Expands the given glob `patterns` and creates a normalized
 * `comments` object for each file in the array.
 *
 * @param {String} `patterns` Glob pattern or file paths to use.
 * @param {String} `dest` Optional destination file path for generating relative links.
 * @param {Object} `options`
 * @return {Array} Returns an array of comments objects.
 */

jscomments.expandFiles = function (patterns, dest, options) {
  if (typeof patterns === 'object') {
    options = patterns;
    dest = options.dest;
    patterns = options.src;
  }

  if (typeof dest === 'object') {
    options = dest;
    dest = null;
  }

  var opts = _.extend({}, options);

  dest = dest || opts.dest || process.cwd();
  return comments.expand(patterns, dest, opts);
};


/**
 * Render a template string with the given `context`. A
 * custom lodash template may be passed on the options.
 *
 * @param  {Object} `context`
 * @param  {Object} `options`
 * @return {String} Return the rendered string.
 */

jscomments.render = function (context, options) {
  var opts = _.extend({}, options);
  var template = opts.template || defaultTemplate;
  var str = _.template(template, {files: context});
  return str.replace(/^\s+|\s+$/g, '');
};


/**
 * Export `jscomments`
 */

module.exports = jscomments;