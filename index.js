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

var parse = require('parse-comments');
var template = require('js-comments-template');
var _ = require('lodash').runInContext();

/**
 * Parse comments from the given `str`.
 *
 * @param  {String} `str` The string to parse.
 * @return  {Object} Object of comments.
 */

exports.parse = parse;

/**
 * Process the given Lo-dash `template` string, passing a
 * `comments` object as context.
 *
 * @param  {String} `template` The lo-dash template to use.
 * @param  {Object} `comments` Object of comments.
 * @return {String}
 */

exports.render = function render(comments, options) {
  var opts = _.extend({file: {path: '', comments: comments}}, options);
  if (opts.filter !== false) {
    opts.file.comments = exports.filter(opts.file.comments, opts);
  }
  opts.template = opts.template || template;
  var settings = {};
  settings.imports = opts.imports || {};
  opts.log = function (msg) {
    return console.log.apply(console, arguments);
  };
  var fn = opts.engine || _.template;
  var result = fn(opts.template, {imports: opts.imports})(opts);
  if (opts.format) return exports.format(result);
  return result;
};

/**
 * Filter and normalize the given `comments` object.
 *
 * @param  {Object} `comments`
 * @param  {Object} `options`
 * @return {Object} Normalized comments object.
 */

exports.filter = function filter(comments, opts) {
  opts = opts || {};
  var len = comments.length, i = 0;
  var res = [];

  while (len--) {
    var o = comments[i++];
    if (o.comment.begin === 1) {
      continue;
    }
    if (o.string && /^.{1,8}!/.test(o.string)) {
      continue;
    }
    if (opts.stripBanner && i === 0) {
      continue;
    }
    if (o.type === 'property') {
      continue;
    }
    if (!o.api || o.api !== 'public') {
      continue;
    }

    // If the user explicitly defines a `@type`,
    // use that instead of the code context type
    if (o && o.type) {
      o.type = o.type;
    }
    o.begin = o.begin || o.comment.begin;
    o.end = o.end || o.comment.end;
    o.context.begin = o.context.begin || o.begin;
    // console.log(o)

    if (o.doc) {
      console.log(o.doc);
      o.doc = '{%= docs("' + o.doc + '") %}';
      o.description = o.doc + '\n\n' + o.description;
    }

    o.line = o.end ? (o.end + 2) : o.begin;

    if (o.noname) {
      o.heading.text = o.noname;
      res.push(o);
      return res;
    }

    var heading = o.heading || {};
    if (o.section === true) {
      heading.level = 1;
    }

    var lvl = heading.level || 2;
    if (o.name) {
      heading.text = o.name;
    }

    if (!o.section) {
      lvl = heading.lvl || 2;
    }

    var text = heading.text;
    var prefix = '######'.slice(0, lvl);

    o.prefix = prefix;
    o.lvl = lvl;

    if (text) {
      if (heading.prefix) {
        text = heading.prefix + text;
      }
      o.prefixed = prefix + ' ' + text;
      o.title = text;
    }
    res.push(o);
  }
  return res;
};

/**
 * Basic markdown corrective formatting
 */

exports.format = function format(str) {
  str = str.replace(/(?:\r\n|\n){3,}/g, '\n\n');
  var re = /^ *(#{1,6})[ \t]*([^\n]+?)[ \t]*#*[ \t]*(?:\n+|$)([\s\S]+?)\n/gm;
  var match;

  while (match = re.exec(str)) {
    str = str.replace(match[2], function (match) {
      return match + '\n';
    });
  }
  return str.trim();
};

/**
 * Format headings
 *
 * Adjust heading levels. Adds one heading level next
 * to all markdown headings to make them correct within
 * the scope of the inheriting document. Headings in
 * fenced code blocks are skipped.
 *
 * @return {String}
 * @api public
 */

exports.headings = function headings(str) {
  var re = /^\s*(`{3})\s*(\S+)?\s*([\s\S]+?)\s*(`{3})\s*(?:\n+|$)/gm;
  str = str.replace(/^#/gm, '##');
  return str.replace(re, function (match) {
    return match.replace(/^##/gm, '#');
  });
};

/**
 * Format markdown, adjusts beginning and ending whitespace only.
 */

function whitespace(str) {
  return str.trim() + '\n';
}

/**
 * Format markdown, aggressive whitespace re-formatting.
 */

function aggressive(str) {
  function replace(a, b) {
    str = str.replace(a, b);
  }

  replace(/[\r\n]+/g, '\n');
  // Not-lists
  replace(/^\s*([^\*]+)$/gm, '\n$1\n');
  // Headings
  replace(/^((#{1,6})\s*(.*?)\s*#*\s*(?:\n|$))/gm, '\n$1\n');
  // Headings
  replace(/^\s+(#.+)/gm, '\n$1');
  // Before fenced code blocks
  replace(/\s*(`{3}\S+)/gm, '\n\n$1');
  // Blockquotes
  replace(/^\s*(>.+)/gm, '\n$1\n');
  return str.split('\n').join('  \n');
}

/**
 * Replace extraneous newlines with a single newline.
 *
 * @title compact
 * @param  {String} str
 *
 * @return {String}
 * @api public
 */

function condense(str, sep) {
  str = str.replace(/\r/g, '');
  sep = sep || '\n';

  str = (str || '\n\n').replace(/\n\n+/g, '\n\n');
  return str.split(sep).map(function (line) {
    return line.trim();
  }).filter(Boolean).join(sep);
}
