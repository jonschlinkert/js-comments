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
var comments = require('..');
var support = require('./support/');
var expected = support.expected;
var fixture = support.fixture;
var trim = support.trim;

describe('.render():', function () {
  describe('filter:', function () {
    it('should parse comments and render markdown from a template:', function () {
      var ctx = comments.filter(comments.parse(fixture.complete));
      trim(comments.render(ctx)).should.equal(expected['complete-raw']);
    });
  });

  describe('formatting:', function () {
    it('should format the markdown using the `.format()` method:', function () {
      var ctx = comments.filter(comments.parse(fixture.complete));
      trim(comments.format(comments.render(ctx))).should.equal(expected['complete-formatted']);
    });

    it('should format the markdown when `options.format` is true:', function () {
      var ctx = comments.filter(comments.parse(fixture.complete));
      trim(comments.render(ctx, {format: true})).should.equal(expected['complete-formatted']);
    });
  });

  describe('api:', function () {
    it('should NOT render a comment when `api: public` is NOT defined', function () {
      var ctx = comments.filter(comments.parse(fixture['api-not-public']));
      trim(comments.format(comments.render(ctx))).should.equal('');
    });

    it('should render a comment when `api: public` IS defined', function () {
      var ctx = comments.filter(comments.parse(fixture.api));
      trim(comments.render(ctx, {format: true})).should.equal('## [foo](#L12)\n\n* `abc` **{String}**: Short description.\n* `xyz` **{String}**');
    });
  });

  describe('doc:', function () {
    it('should create a template from the `doc` property', function () {
      var ctx = comments.filter(comments.parse(fixture['doc']));
      trim(comments.format(comments.render(ctx))).should.equal('{%= docs("foo") %}');
    });
  });
});

