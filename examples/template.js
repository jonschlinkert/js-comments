/*!
 * Example custom template. Pass the path to your
 * template on the `template` option.
 *
 * In verb, you can set the path the following ways:
 *
 * **API**
 *
 * ```js
 * verb.option('apidocs', {template: './path/to/template.js'});
 * ```
 *
 * **CLI**
 *
 * Store the path or module name on the global config:
 *
 * ```sh
 * $ verb --set apidocs.template="./path/to/template.js"
 * ```
 */

module.exports = [
  // begin comments
  '<% _.each(file.comments, function(comment) { %>',

  // Title and lead
  '<% if (comment.title) { %>' +
  '<%= comment.prefix ? comment.prefix + " " : "## " %><%= "[" + comment.title + "](" + file.path + "#L" + (comment.end + 2) + ")" %>' +
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
