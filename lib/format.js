/*!
 * js-comments <https://github.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var replace = require('frep');


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

exports.headings = function(str) {
  return replace.strWithArr(str, [
    {
      pattern: /^#/gm,
      replacement: '##'
    },
    {
      pattern: /^\s*(`{3})\s*(\S+)?\s*([\s\S]+?)\s*(`{3})\s*(?:\n+|$)/gm,
      replacement: function (match) {
        return match.replace(/^##/gm, '#');
      }
    }
  ]);
};


/**
 * Format markdown, adjusts beginning and ending whitespace only.
 *
 * @method format
 * @param   {String}  str
 * @return  {String}
 */

exports.whitespace = function(str) {
  var content = replace.strWithArr(str, [
    {
      // First whitespace
      pattern: /^\s+/,
      replacement: ''
    },
    {
      // Last whitespace
      pattern: /\s+$/,
      replacement: '\n'
    }
  ]);
  content = content.split('\n').join('  \n');
  return content;
};


/**
 * Format markdown, aggressive whitespace re-formatting.
 *
 * @method format
 * @param   {String}  str
 * @return  {String}
 */

exports.aggressive = function(str) {
  var content = replace.strWithArr(str, [
    {
      // Newlines
      pattern: /[\r\n]+/g,
      replacement: '\n'
    },
    {
      // Not-lists
      pattern: /^\s*([^\*]+)$/gm,
      replacement: '\n$1\n'
    },
    {
      // Headings
      pattern: /^((#{1,6})\s*(.*?)\s*#*\s*(?:\n|$))/gm,
      replacement: '\n$1\n'
    },
    {
      // Headings
      pattern: /^\s+(#.+)/gm,
      replacement: '\n$1'
    },
    {
      // Before fenced code blocks
      pattern: /\s*(`{3}\S+)/gm,
      replacement: '\n\n$1'
    },
    {
      // Blockquotes
      pattern: /^\s*(>.+)/gm,
      replacement: '\n$1\n'
    }
  ]);

  content = content.split('\n').join('  \n');
  return content;
};
