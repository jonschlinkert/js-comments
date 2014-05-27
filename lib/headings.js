
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

module.exports = function(str, toc) {
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
};