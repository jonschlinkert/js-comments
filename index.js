var file = require('fs-utils');
var Strings = require('strings');
var comments = require('./lib/comments');
var format = require('./lib/format');
var condense = require('./lib/condense');
var _ = require('lodash');

var strings = new Strings();

strings.parser('headings', {
  pattern: /^((#{1,6})\s*(.*?)\s*#*\s*(?:\n|$))/gm,
  replacement: ''
});

var tmpl = file.readFileSync('lib/comment.tmpl.md');
var result = comments('test/fixtures/strings.js', 'actual.md');
var dest = 'test/actual/comments.json';


file.writeJSONSync(dest, result);

var output = _.template(tmpl, {files: result});

output = output.replace(/^\s+/g, '');

// function heading(str) {
//   var re = /^((#{1,6})\s*(.*?)\s*#*\s*(?:\n|$))/gm;
//   console.log(str.match(re));
//   return str;
// }

function makeLink(str) {
  var orig = '[' + str + ']';
  var slug = str
    .replace(/[\W_]+/g, '-')
    .replace(/^[\W]+|[\W]+$/g, '')
    .toLowerCase();
  var link = orig + '(#' + slug + ')';
  return link;
}

function heading(str, toc) {
  var heading = [];
  var re = /^#{1,6}.+/gm;
  str = str.replace(re, function(line) {
    var innerRe = /^(#{1,6}\s*.+)\((.+)\)/gm;
    var text = line.replace(innerRe, '$1');
    var link = makeLink(text);
    var h1 = link.replace(/^\[# /, '* [');
    var h2 = h1.replace(/^\[## /, '  * [');

    heading.push(h2);

    line = line.replace(innerRe, function(match, a, b) {
      a = a.trim();
      b = ' ( ' + b.replace(/^\(|\)$/g, '').trim() + ' )';
      return a + b;
    });

    return line;
  });

  if (toc) {
    return heading.join('\n') + '\n\n' + str;
  }
  return str;
}

file.writeFileSync('test/actual/comments.md', heading(output)); // format(output)

module.exports = comments;
