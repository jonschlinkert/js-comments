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


describe('when a string is passed:', function () {
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