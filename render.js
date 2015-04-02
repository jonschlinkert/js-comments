/*!
 * js-comments-template <https://github.com/jonschlinkert/js-comments-template>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT License (MIT)
 */

module.exports = [
  // begin comments
  _.each(comments, function(comment) {

  // Title and lead

  function title (comment) {
    if (comment.title) {
      var title = comment.prefix ? comment.prefix + " " : "## ";
      var link = "[" + comment.title + "](" + relative(dest, src) + "#L" + (comment.end + 2) + ")";
      return title + link;
    }
    return '';
  }

  var lead = '';
  if (comment.lead) {
    lead += "\\n" + comment.lead + "\\n";
  }

  function params(comment) {
    var res = '* ';
    comment.params.forEach(function(param) {
      if (param.name) {
        res += '`' + param.name + '`';
      }
      if (param.type) {
        res += '**{' + param.type + '}**';
      }
      if (param.description) {
        res += ": " + param.description;
      }
    }
    return res;
  }


  '  <% if (param.options) { %>',
  '  <% _.each(param.options, function(option) { %>' +
  '  - `<%= option.name %>` **{<%= option.type %>}**<%= option.description ? ": " : "" %><%= option.description %>',
  '  <% }); %>' +
  '  <% } %>' +

  '  <% if (param.properties) { %>' +
  '  <% _.each(param.properties, function(prop) { %>' +
  '  - `<%= prop.name %>` **{<%= prop.type %>}**<%= prop.description ? ": " : "" %><%= prop.description %>' +
  '  <% }); %>' +
  '  <% } %>' +

  '<% }); %>' +

  // returns
  '<% if (comment.returns && comment.returns.length > 0) { %>' +
  '<% _.each(comment.returns, function(ret) { %>',
  '* `returns`<%= ret.type ? " **{" + ret.type + "}**" : "" %><%= ret.name ? " `" + ret.name + "`" : "" %><%= ret.description ? ": " : "" %><%= ret.description %>  ',
  '<% }); %>',
  '<% } %>',

  '<% } %>' +

  // Description
  '<% if (comment.description) { %><%= "\\n" + comment.description + "\\n" %><% } %>' +
  '<% }); %>'
].join('\n');
