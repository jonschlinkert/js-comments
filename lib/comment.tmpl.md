<% _.each(files, function(file) { %> <% _.each(file.comments, function(comments) { %>
<% _.each(comments, function(comment) { %>


<%= comment.description %>
<% _.each(comment.params, function(param) { %>
* <%= param.name %> {<%= param.type %>}: <%= param.description %> <% }); %>
* `return`: <%= comment.return %> <% }); %> <% }); %>
<% }); %>