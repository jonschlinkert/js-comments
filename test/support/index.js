var fs = require('fs');
var path = require('path');

var fixtures = path.join(__dirname, '../fixtures');
var expected = path.join(__dirname, '../expected');

exports.fixture = require('to-exports')(fixtures, {read: read, filter: filter});
exports.expected = require('to-exports')(expected, {read: read, filter: filter});

exports.trim = function trim(str) {
  return str.split('\n').map(function (line) {
    return line.replace(/^\s+|\s+$/g, '');
  }).join('\n');
};


function filter(fp) {
  return true;
}

function read(fp) {
  return fs.readFileSync(fp, 'utf8');
}
