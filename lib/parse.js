// Based on https://github.com/caolan/scrawl

var trimRight = function(str) {
  return str.replace(/\s+$/, '');
};

var countNewLines = function (str) {
  var count = 0;
  for (var i = 0; i < str.length; i++) {
    if (str[i] === '\n') {
      count++;
    }
  }
  return count;
};

var stripStars = function (line) {
  return trimRight(line.replace(/^\s*\*?\s?/, ''));
};

var parseParams = function(param) {
  var re = /(?:^\{([^\}]+)\}\s+)?(?:([\S]+)\s*)?([\s\S]*)?/;
  var match = param.match(re);
  return {
    type: match[1],
    name: match[2],
    description: (match[3] || '').replace(/^\s*-\s*/, '')
  };
};



var parseTags = function (comment) {

  // strip trailing whitespace from description
  if (comment.description) {
    comment.description = trimRight(comment.description);
  }

  // strip trailing whitespace from examples
  if (comment.example) {
    comment.example = trimRight(comment.example);
  }

  // parse @param tags
  if (comment.param) {
    var params = comment.param || [];
    params = !Array.isArray(params) ? [params] : params;

    comment.params = params.map(function (str) {
      return parseParams(str);
    });
  }

  // parse @returns tags
  if (comment.returns) {
    var match = /^\{([^\}]+)\}/.exec(comment.returns);
    if (match) {
      comment.returns = match[1];
    }
  }
  return comment;
};



var parseComment = function (str) {
  var afterTags = false;
  var lines = str.split('\n');
  var afterNewLine = false;
  var lastTag;

  var comment = lines.reduce(function (c, str) {
    var line = stripStars(str);

    if (line) {
      var match = line.match(/^\s*@([\S]+)\s*(.*)/);
      if (match) {
        afterTags = true;
        var tagname = match[1];
        var tagvalue = match[2].replace(/^\s+/, '');
        lastTag = tagname;
        if (c.hasOwnProperty(tagname)) {
          // tag already exists
          if (!Array.isArray(c[tagname])) {
            c[tagname] = [c[tagname]];
          }
          c[tagname].push(tagvalue);
        } else {
          // new tag
          c[tagname] = tagvalue || true;
        }
      } else if (lastTag && !afterNewLine) {
        var val = line.replace(/^\s+/, '');
        if (Array.isArray(c[lastTag])) {
          c[lastTag][c[lastTag].length - 1] += ' ' + val;
        } else {
          c[lastTag] += ' ' + val;
        }
      } else {
        lastTag = null;
        if (!afterTags) {
          if (c.description) {
            c.description += '\n' + line;
          } else {
            c.description = line;
          }
        } else {
          if (c.example) {
            c.example += '\n' + line;
          } else {
            c.example = line;
          }
        }
      }
      afterNewLine = false;
    } else {
      afterNewLine = true;
      if (!afterTags) {
        if (c.description) {
          c.description += '\n' + line;
        }
      } else {
        if (c.example) {
          c.example += '\n' + line;
        }
      }
    }
    return c;
  }, {});

  return parseTags(comment);
};



/**
 * Parse comments
 * @param   {String}  str
 * @return  {String}
 */

module.exports = function (str) {
  var match, comments = [];
  var lineNumber = 1;
  while (match = (/\/\*\*([\s\S]*?)\*\//g).exec(str)) {
    var _str = str;

    // add lines from before the comment
    lineNumber += countNewLines(_str.substr(0, match.index));
    str = str.substr(match.index + match[1].length);
    var comment = parseComment(match[1]);
    comment.line = lineNumber;

    // Allow @words to be escaped with a single backtick, e.g. `@word,
    // then remove the backtick before the final result.
    if (/^\`\@/gm.test(comment.description)) {
      comment.description = comment.description.replace(/^`@/gm, '@');
    }

    comments.push(comment);

    // add lines from the comment itself
    lineNumber += countNewLines(_str.substr(match.index, match[1].length));
  }
  return comments;
};
