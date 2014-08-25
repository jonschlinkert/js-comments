/*!
 * js-comments <https://githuc.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT License (MIT)
 */

'use strict';

var fs = require('fs');
var should = require('should');
var comments = require('../lib');


function parseFixture(filepath) {
  var src = 'test/fixtures/' + filepath + '.js';
  var str = fs.readFileSync(src, 'utf8');
  return comments.parse(str);
}

var comment = [
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
      var actual = comments.parse('/**\n@foo {Object} `bar`\n*/');
      actual.length.should.equal(1);
      actual[0].should.have.property('foo');
    });

    it('should parse a string', function () {
      var actual = comments.parse(comment);
      actual.length.should.equal(1);
      actual[0].should.have.property('param');
    });

    it('should parse comments and return an object', function () {
      var actual = comments.parse('/**\n@foo {Object} `bar`\n*/');
      actual.should.be.an.object;
    });
  });

  describe('parse files', function () {
    it('should parse @params', function () {
      var actual = parseFixture('params');
      actual.length.should.equal(1);
      actual[0].should.have.property('param');
    });

    it('should parse @return', function () {
      var actual = parseFixture('return');
      actual.length.should.equal(1);
      actual[0].should.have.property('return');
    });

    it('should parse @api', function () {
      var actual = parseFixture('api');
      actual.length.should.equal(1);
      actual[0].should.have.property('api');
    });
  });
});