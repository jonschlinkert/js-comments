/*!
 * js-comments <https://github.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var comments = require('../lib');
require('should');

var comment = [
  '/*!',
  ' * This is a banner',
  ' */',
  '',
  '/**',
  ' * ## .parser',
  ' *',
  ' * Set a parser that can later be used to parse any given string.',
  ' *',
  ' * ```js',
  ' * strings.parser (name, replacements)',
  ' * ```',
  ' *',
  ' * **Example**',
  ' *',
  ' * {%= docs("example-parser.md") %}',
  ' *',
  ' * @param {String} `name`',
  ' * @param {Object|Array} `arr` Object or array of replacement patterns to associate.',
  ' *   @property {String|RegExp} `pattern`',
  ' *   @property {String|Function} `replacement`',
  ' * @return {Strings} to allow chaining',
  ' *   @property {Array} `foo`',
  ' * @api public',
  ' */'
].join('\n');


describe('.parse():', function () {
  describe('parse strings:', function () {
    it('should parse a string', function () {
      var actual = comments.parse(comment);
      actual.length.should.equal(1);
      actual[0].should.have.property('param');
    });
  });
});