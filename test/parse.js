/*!
 * js-comments <https://githuc.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT License (MIT)
 */

var file = require('fs-utils');
var expect = require('chai').expect;
var parseComment = require('../lib/parse');

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
    expect(actual).to.have.length.of.at.least(1);
    expect(actual[0]).to.have.property('foo');
  });

  it('should parse a string', function () {
    var actual = parseComment(comment)
    expect(actual).to.have.length.of.at.least(1);
    expect(actual[0]).to.have.property('param');
  });

  it('should parse @params', function () {
    var actual = readFixture('params');
    expect(actual).to.have.length.of.at.least(1);
    expect(actual[0]).to.have.property('param');
  });

  it('should parse @return', function () {
    var actual = readFixture('return');
    expect(actual).to.have.length.of.at.least(1);
    expect(actual[0]).to.have.property('return');
  });

  it('should parse @api', function () {
    var actual = readFixture('api');
    expect(actual).to.have.length.of.at.least(1);
    expect(actual[0]).to.have.property('api');
  });

});

