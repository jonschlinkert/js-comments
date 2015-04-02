/*!
 * js-comments-template <https://github.com/jonschlinkert/js-comments-template>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors
 * Licensed under the MIT License (MIT)
 */

module.exports = [
  // begin comments
  '<% _.each(comments, function(comment) { %>',

  // Title and lead
  '<% if (comment.title) { %>' +
  '<%= comment.prefix ? comment.prefix + " " : "## " %><%= "[" + comment.title + "](" + relative(dest, src) + "#L" + (comment.end + 2) + ")" %>' +
  '<% if (comment.lead) { %><%= "\\n" + comment.lead + "\\n" %><% } %>' +

  // params
  '<% _.each(comment.params, function(param) { %>',
  '* <% if (param.name) { %>`<%= param.name %>` <% } %>**{<%= param.type %>}**<%= param.description ? ": " : "" %><%= param.description %>' +

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
