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


describe('.parseFiles():', function () {
  it('should expand a glob of files and parse comments.', function () {
    var actual = comments.parseFiles('test/fixtures/*.js', 'README.md');

    actual.api.comments[0].should.have.property('param');
    actual.banner.comments[0].should.have.property('param');
  });
});