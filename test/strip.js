/*!
 * js-comments <https://github.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var fs = require('fs');
require('should');
var strip = require('strip-banner');


function stripBanner(filepath) {
  var src = 'test/fixtures/' + filepath + '.js';
  var str = fs.readFileSync(src, 'utf8');
  return strip(str);
}

describe('utils:', function () {
  it('should strip banners', function () {
    var actual = stripBanner('banner');
    /js-comments/.test(actual).should.be.false;
  });
});