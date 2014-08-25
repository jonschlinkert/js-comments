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


describe('.expand():', function () {
  describe('expand files', function () {
    it('should expand a glob of files and parse comments.', function () {
      var actual = comments.expand('test/fixtures/*.js', 'README.md');
      console.log(actual)
      // actual.length.should.equal(1);
      // actual[0].should.have.property('param');
    });

  });
});