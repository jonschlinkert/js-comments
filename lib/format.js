/*!
 * js-comments <https://github.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT License (MIT)
 */

'use strict';

var replace = require('frep');
var Strings = require('strings');
var strings = new Strings();


/**
 * Adjust heading levels. Adds one heading level next
 * to all markdown headings to make them correct within
 * the scope of the inheriting document. Headings in
 * fenced code blocks are skipped.
 *
 * @return {String}
 * @api public
 */

var headings = [
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
];

strings.parser('headings', headings);

exports.headings = function(str) {
  return replace.strWithArr(str, headings);
};





var whitespace = [
  {
    // First whitespace
    pattern: /^\s*/,
    replacement: ''
  },
  {
    // Last whitespace
    pattern: /\s*$/,
    replacement: '\n'
  }
];

/**
 * Format markdown, adjusts beginning and ending whitespace only.
 *
 * @method format
 * @param   {String}  str
 * @return  {String}
 */

exports.whitespace = function(str) {
  var content = replace.strWithArr(str, whitespace);
  content = content.split('\n').join('  \n');
  return content;
};


// Markdown formatting
var aggressive = [
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
];

/**
 * Format markdown, aggressive whitespace re-formatting.
 *
 * @method format
 * @param   {String}  str
 * @return  {String}
 */

exports.aggressive = function(str) {
  var content = replace.strWithArr(str, aggressive);
  content = content.split('\n').join('  \n');
  return content;
};
