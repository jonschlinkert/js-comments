var fs = require('fs');
var path = require('path');
var comments = require('../');

var str = fs.readFileSync(path.join(__dirname, '..', 'index.js'), 'utf8');
var context = comments.parse(str);
var result = comments.render(context);

console.log(result);
