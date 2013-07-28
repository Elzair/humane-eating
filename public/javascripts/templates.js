define([], function() {
  // Define the underscore templates used to render the views
  var templates = {
    title: '<%= title %>',
    image: '<img src="<%= src %>" alt="<%= caption %>" class="<%=  classes %>">'
  };
  return templates;
});
