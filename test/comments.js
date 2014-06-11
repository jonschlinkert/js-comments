/**
 * Tag plugin for Verb
 */

const fs = require('fs');
const path = require('path');
const file = require('fs-utils');
const relative = require('relative');
const _ = require('lodash');
const comments = require('../index');



module.exports = function (verb) {
  verb.options = verb.options || {};
  var utils = verb.utils;
  var tags = {};

  tags.jscomments = function (patterns, options) {
    options = _.extend({}, options);

    // Extend the context with options defined in the tag
    _.extend(verb.context, options);
    _.extend(verb.options, options);

    var matches = [];
    var msg;

    matches = file.find(patterns, {
      filter: 'isFile'
    });

    // If a filename was given, but no results are returned, kindly notify the user.
    if (!matches.length) {
      msg = ' [nomatch] · verb could not find a match for {%%= glob("' + patterns + '") %}';
      verb.log.warn('  ' + verb.runner.name + msg);
      return;
    }

    var output = _.map(matches, function(filepath) {
      return comments(filepath, 'README.md')
    }).join('\n\n');
    return output;
  };

  return tags;
};

