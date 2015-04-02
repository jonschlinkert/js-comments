/*!
 * js-comments <https://github.com/jonschlinkert/js-comments>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/* deps:mocha */
require('should');
var fs = require('fs');
var support = require('./support/');
var fixture = support.fixture;
var comments = require('..');

describe('.parse():', function () {
  describe('parse strings:', function () {
    it('should parse a string', function () {
      var actual = comments.filter(comments.parse(fixture.complete));
      actual.length.should.equal(1);
      actual[0].should.have.property('param');
    });
  });
});
