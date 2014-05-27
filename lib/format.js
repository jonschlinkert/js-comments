/**
 * Verb <https://github.com/assemble/verb>
 * Generate markdown documentation for GitHub projects.
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

const replace = require('frep');
const Strings = require('strings');
const strings = new Strings();


/**
 * Adjust heading levels. Adds one heading level next
 * to all markdown headings to make them correct within
 * the scope of the inheriting document. Headings in
 * fenced code blocks are skipped.
 *
 * @return {String}
 * @api public
 */


strings.parser('headings', [
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


exports.headings = function(str) {
  return replace.strWithArr(str, headings);
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

exports.whitespace = function(str, options) {
  var content = replace.strWithArr(str, whitespace);
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

exports.aggressive = function(str, options) {
  var content = replace.strWithArr(str, aggressive);
  content = content.split('\n').join('  \n');
  return content;
};
