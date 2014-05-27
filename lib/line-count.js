const _ = require('lodash');
const file = require('fs-utils');

module.exports = function(content) {
  if (_.isEmpty(content)) {
    return 0;
  }
  content = file.normalizeNL(content);
  return content.split('\n').length;
};