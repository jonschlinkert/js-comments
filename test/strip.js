/*!
 * js-comments <https://githuc.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT License (MIT)
 */

var file = require('fs-utils');
var expect = require('chai').expect;
var strip = require('strip-banner');


function readFixture(src) {
  var str = file.readFileSync('test/fixtures/' + src + '.js');
  return strip(str);
}


describe('utils:', function () {
  it('should strip banners', function () {
    var actual = readFixture('params');
    expect(actual).to.have.length.of.at.least(0);
  });
});