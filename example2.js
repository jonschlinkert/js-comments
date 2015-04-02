'use strict';

var fs = require('fs');
var path = require('path');
var cwd = require('cwd');
var relative = require('relative');
var mapFiles = require('map-files');
var lodash = require('engine-lodash');
var comments = require('./');
var _ = require('lodash');

var defaultTemplate = require('./template2');
var App = require('template');
var app = new App();

app.helper('log', function (msg) {
  console.log('%j', msg);
});

app.helper('relative', require('relative'));

app.loader('files', function (patterns, options) {
  return mapFiles.apply(mapFiles, arguments);
});

app.loader('parse', ['files'], function (files) {
  var keys = Object.keys(files);
  var len = keys.length;
  var res = {};

  while (len--) {
    var key = keys[len];
    var file = files[key];
    var fp = file.path;
    file.name = path.basename(fp, path.extname(fp));
    file.comments = comments.parse(file.content);
    file.engine = 'apidocs';
    file.ext = 'apidocs';
    res[file.name] = file;
  }
  return res;
});


app.engine('apidocs', function (str, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts; opts = {};
  }

  opts = opts || {};
  opts.comments = comments.parse(str);
  opts.imports = opts.helpers;

  var foo = render(opts.comments, opts);

  try {
    lodash.render(opts.template, opts, function (err, str) {
      if (err) return cb(err);
      var re = /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)([\s\S]+?)\n/gm;
      str = str.replace(/(?:\r\n|\n){3,}/g, '\n\n');
      str = str.replace(re, function (match, lvl, line) {
        return lvl + ' ' + line + '\n';
      });
      cb(null, str.trim());
    });
  } catch (err) {
    console.log(err);
    return cb(err);
  }
});

app.create('comment', {isPartial: true}, ['parse']);
app.create('snippet', {isPartial: true});
app.comments('test/fixtures/*.js');
app.snippets('templates/*.md');

app.asyncHelper('apidocs', function (name, opts, cb) {
  var template = app.getComment(name);
  var fp = template.path;

  if (typeof opts === 'function') {
    cb = opts; opts = {};
  }

  opts = opts || {};
  opts.dest = relative(opts.dest || cwd('README.md'));

  if (opts.dest.indexOf('://github') !== -1) {
    opts.dest = opts.dest + '/blob/master/' + fp;
  }

  opts.template = opts.template || defaultTemplate;
  opts.src = fp;

  _.extend(opts, this.context);
  opts.helpers = this.app._.helpers;

  app.render(template, opts, function (err, content) {
    return cb(null, content);
  });
});


app.page('zzz.md', {content: '<%= apidocs("opts") %>'});

app.render('zzz.md', function (err, content) {
  if (err) console.log(err);
  // console.log(content);
});


function render (comments, opts) {
  var len = comments.length, i = 0;
  var res = '';

  while (len--) {
    var comment = comments[i++];
    res += title(comment, opts);
    res += params(comment, opts);

  }
  return res;
}


// Title and lead
// [foo](bar#L123)
function title(comment, opts) {
  var res = '';
  if (comment.title) {
    res += comment.prefix ? comment.prefix + ' ' : '## ';
    res += '[' + comment.title + '](' + relative(opts.dest, opts.src);
    res += '#L' + (comment.end + 2) + ')';
    res += '\n';
  }

  if (comment.lead) {
    res += '\n' + comment.lead + '\n'
  }
  return res;
}

// Params
function params(comment, opts) {
  var res = '';
  _.each(comment.params, function(param) {
    if (param.name) {
      res += '- ' + backtick(param.name);
    }
    res += ' ';
    res += type(param.type);
    res += param.description ? ': ' : '';
    res += '\n';

    if (param.options) {
      _.each(param.options, function(option) {
        res += '- ' + backtick(option.name);
        res += ' ';
        res += type(option.type);
        res += option.description ? ': ' : '';
      });
    }

    if (param.properties) {
      _.each(param.properties, function(prop) {
        res += '- ' + backtick(prop.name);
        res += ' ';
        res += type(prop.type);
        res += prop.description ? ": " : "";
      });
    }
  });
  return res;
}

function backtick(str) {
  return '`' + str + '`';
}

function type(str) {
  return '**{' + str + '}**';
}
