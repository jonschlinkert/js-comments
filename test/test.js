/*!
 * parse comment
 *
 * Copyright (c) 2014 parse comment, contributors
 * Licensed under the MIT License (MIT)
 */

var expect = require('chai').expect;
var parseComment = require('../');

describe('when foo is passed:', function () {
  it('should convert foo to bar.', function () {
    var fixture = '/*!\n * foo\n */\n\n\n/**\n * # Name \n * @param {String} `name`\n * @param {String} `propstring`\n */';
    var actual = parseComment(fixture);
    var expected = {};
    expect(actual).to.eql(expected);
  });
});