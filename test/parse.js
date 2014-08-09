/*!
 * js-comments <https://githuc.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT License (MIT)
 */

var file = require('fs-utils');
var expect = require('chai').expect;
var parseComment = require('../lib/comments');

function readFixture(src) {
  var str = file.readFileSync('test/fixtures/' + src + '.js');
  return parseComment(str);
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

describe('when a string is passed:', function () {
  it('should parse a string', function () {
    var actual = parseComment('/**\n@foo {Object} `bar`\n*/')
    console.log(actual)
    // actual.comments.length.should.be(1);
    // actual.comments[0].should.have.property('foo');
  });

  // it('should parse a string', function () {
  //   var actual = parseComment(comment)
  //   actual.comments.length.should.be(1);
  //   actual.comments[0].should.have.property('param');
  // });

  // it('should parse @params', function () {
  //   var actual = readFixture('params');
  //   actual.comments.length.should.be(1);
  //   actual.comments[0].should.have.property('param');
  // });

  // it('should parse @return', function () {
  //   var actual = readFixture('return');
  //   actual.comments.length.should.be(1);
  //   actual.comments[0].should.have.property('return');
  // });

  // it('should parse @api', function () {
  //   var actual = readFixture('api');
  //   actual.comments.length.should.be(1);
  //   actual.comments[0].should.have.property('api');
  // });

});

