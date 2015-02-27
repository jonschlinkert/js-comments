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

function parseFixture(filepath) {
  var src = __dirname + '/fixtures/' + filepath + '.js';
  var str = fs.readFileSync(src, 'utf8');
  return comments.parse(str);
}

describe('.parseFiles():', function () {
  it('should expand a glob of files and parse comments.', function () {
    var actual = comments.parseFiles('test/fixtures/*.js', 'README.md');
    actual.api.comments[0].should.have.property('param');
    actual.banner.comments[0].should.have.property('param');
  });

  it('should create a relative path to the dest file.', function () {
    var actual = comments.parseFiles('test/fixtures/api.js', 'README.md');
    actual.api.should.have.property('path');
    actual.api.path.should.equal('./test/fixtures/api.js');
  });

  it('should not make the dest path relative if it\'s a url.', function () {
    var actual = comments.parseFiles('test/fixtures/api.js', 'https://github.com/foo/bar');
    actual.api.should.have.property('path');
    actual.api.path.should.equal('https://github.com/foo/bar/blob/master/api.js');
  });

  it('should parse @params', function () {
    var actual = parseFixture('params');
    actual[0].should.have.property('param');
  });

  it('should parse @return', function () {
    var actual = parseFixture('return');
    actual[0].should.have.property('return');
  });

  it('should parse @api', function () {
    var actual = parseFixture('api');
    actual[0].should.have.property('api');
  });
});
