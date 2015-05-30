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
var relative = require('relative');
var union = require('arr-union');
var parse = require('parse-comments');
var helpers = require('logging-helpers');
var writeFile = require('write');
var _ = require('lodash');

/**
 * Default template to use
 */

var defaultTemplate = require('js-comments-template');

/**
 * Parse comments from the given `str`.
 *
 * ```js
 * var fs = require('fs');
 * var str = fs.readFileSync('foo.js', 'utf8');
 * comments.parse(str, options);
 * ```
 *
 * @param  {String} `str` The string to parse.
 * @param  {Object} `options` Options to pass to [parse-comments]
 * @return  {Array} Array of comment objects.
 * @api public
 */

exports.parse = parse;

/**
 * Process the given Lo-dash `template` string, passing a
 * `comments` object as context.
 *
 * ```js
 * comments.render(obj, options);
 * ```
 *
 * @param  {Array} `comments` Array of comment objects.
 * @param  {String} `template` The lo-dash template to use.
 * @return {String}
 * @api public
 */

exports.render = function render(comments, template, options) {
  if (typeof template !== 'string') {
    options = template;
    template = null;
  }

  var defaults = {file: {path: ''}};
  var opts = _.merge({}, defaults, options);
  opts.file.path = relative(opts.src || opts.path || opts.file.path || '');

  var ctx = _.cloneDeep(opts);
  ctx.file.comments = comments;
  _.merge(ctx, comments.options);

  if (opts.filter !== false) {
    ctx.file.comments = exports.filter(ctx.file.comments, ctx);
  }

  var settings = {};
  settings.imports = _.merge({}, helpers, ctx.imports);

  var fn = ctx.engine || _.template;
  ctx.template = template || ctx.template || defaultTemplate;

  var result = fn(ctx.template, settings)(ctx);
  if (ctx.format) return exports.format(result);
  return result;
};

/**
 * Basic markdown corrective formatting
 */

exports.format = function format(str) {
  str = str.replace(/(?:\r\n|\n){3,}/g, '\n\n');
  var headingRe = /^(#{1,6})\s*([^\n]+)\s*/gm;
  var boldRe = /^\s+\*\*([^\n]+)\*\*(?=\n)\s+/gm;
  var match;

  while(match = headingRe.exec(str)) {
    str = str.split(match[0]).join(match[1] + ' ' + match[2] + '\n\n');
  }

  while(match = boldRe.exec(str)) {
    str = str.split(match[0]).join('\n**' + match[1] + '**\n\n');
  }
  return str.trim();
};

/**
 * Write markdown API documentation to the given `dest` from the code
 * comments in the given JavaScript `src` file.
 *
 * @param  {String} `src` Source file path.
 * @param  {String} `dest` Destination file path.
 * @param  {Object} `options`
 * @return {String} API documentation
 * @api public
 */

exports.renderFile = function renderFile(src, dest, options) {
  var opts = _.merge({src: path.resolve(src), dest: path.resolve(dest)}, options);
  var str = fs.readFileSync(opts.src, 'utf8');
  var ctx = exports.filter(exports.parse(str, opts), opts);
  var res = exports.format(exports.render(ctx, opts)).trim();
  writeFile.sync(dest, res);
};

/**
 * Filter and normalize the given `comments` object.
 *
 * @param  {Object} `comments`
 * @param  {Object} `options`
 * @return {Object} Normalized comments object.
 */

exports.filter = function filter(comments, opts) {
  comments = comments || [];
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

    if (o['public']) {
      o.api = 'public';
    }

    // update line numbers
    o.begin = o.begin || o.comment.begin;
    o.context.begin = o.context.begin || o.begin;
    o.end = o.end || o.comment.end;
    o.line = o.end ? (o.end + 2) : o.begin;

    if (o.returns && o.returns.length) {
      o.returns.map(function (ele) {
        var len = ele.description.length;
        if (ele.description.charAt(0) === '{' && ele.description[len - 1] === '}') {
          ele.type = ele.description.slice(1, len - 1);
          delete ele.description;
        }
      });
    }

    if (o.doc) {
      if (o.doc.indexOf('./') === 0) {
        var src = opts.src || o.file && o.file.path;
        if (src) {
          var dir = path.dirname(src);
          o.doc = path.resolve(dir, o.doc);
          var str = fs.readFileSync(o.doc, 'utf8');
          o.extras = str;
        }
      } else {
        var tmp = o.doc;
        var tag = makeTag(tmp, opts);
        o.doc = null;
        o.description = o.description || '';
        o.description = tag + '\n\n' + o.description;
      }
    }

    if (o.noname) {
      o.heading.text = o.noname;
      res.push(o);
      o = null;
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
    var prefix = '######'.slice(0, lvl + 1);

    o.prefix = prefix;
    o.lvl = lvl;

    if (text) {
      if (heading.prefix && heading.prefix === '.' && text.charAt(0) !== '.') {
        text = heading.prefix + text;
        heading = null;
      }
      o.prefixed = prefix + ' ' + text;
      o.title = text;

      if (/^\.{2,}/.test(o.title)) {
        o.title = '.' + o.title.replace(/^\.+/, '');
      }
    }

    o.examples = o.examples || [];
    if (o.name && typeof opts.examples === 'object' && opts.examples.hasOwnProperty(o.name)) {
      o.examples = union(o.examples, opts.examples[o.name]);
    }

    o.examples.forEach(function (example) {
      o.description = o.description.split(example.block).join('');
      o.description = o.description.split(/\s+\*\*Examples?\*\*\s+/).join('\n');
      o.description = o.description.split(/\n{2,}/).join('\n').replace(/\s+$/, '');
    });

    res.push(o);
    o = null;
  }
  return res;
};

function makeTag(str, opts) {
  if (opts && opts.tag) return opts.tag(str);
  return '<%= docs("' + str + '") %>';
}
