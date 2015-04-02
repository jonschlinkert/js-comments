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
var parse = require('parse-comments');
var tmpl = require('js-comments-template');
var _ = require('lodash');

// function read (fp) {
//   return fs.readFileSync(fp, 'utf8');
// }

// // var str = read('test/fixtures/opts.js');

/**
 * Parse comments from the given `str`.
 *
 * @param  {String} `str` The string to parse.
 * @return  {Object} Object of comments.
 */

exports.parse = function parser(str, options, cb) {
  return filter(parse(str, options), options);
};

/**
 * Process the given Lo-dash `template` string, passing a
 * `comments` object as context.
 *
 * @param  {String} `template` The lo-dash template to use.
 * @param  {Object} `comments` Object of comments.
 * @return {String}
 */

exports.render = function render(template, comments, options) {
  options = options || {};
  var settings = {imports: options.imports };

  var result = _.template(template || tmpl, settings)(comments);
  if (options.format) return format(condense(result));
  return result;
};

/**
 * Filter and normalize the given `comments` object.
 *
 * @param  {Object} `comments`
 * @param  {Object} `options`
 * @return {Object} Normalized comments object.
 */

function filter(comments, opts) {
  opts = opts || {};

  return comments.filter(function (o, i) {
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
      return true;
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

    if (o.noname) {
      o.heading.text = o.noname;
      return o;
    }

    var heading = o.heading || {};
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

    return o;
  });
};

function format(str) {
  str = str.split('\r').join('').replace(/\n{3,}/g, '\n\n');
  var re = /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)([\s\S]+?)\n/gm;
  var match;

  while (match = re.exec(str)) {
    str = str.replace(match[2], function (_) {
      return _ + '\n';
    });
  }
  return str.replace(/^\s+|\s+$/g, '');
}

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

function headings(str) {
  var re = /^\s*(`{3})\s*(\S+)?\s*([\s\S]+?)\s*(`{3})\s*(?:\n+|$)/gm;
  str = str.replace(/^#/gm, '##');
  return str.replace(re, function (match) {
    return match.replace(/^##/gm, '#');
  });
}

/**
 * Format markdown, adjusts beginning and ending whitespace only.
 *
 * @method format
 * @param   {String}  str
 * @return  {String}
 */

function whitespace(str) {
  return str.trim() + '\n';
}

/**
 * Format markdown, aggressive whitespace re-formatting.
 *
 * @method format
 * @param   {String}  str
 * @return  {String}
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
