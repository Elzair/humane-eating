define([], function() {
  var templates = {
    title: '<%= title %>',
    image: '<img src="<%= src %>" alt="<%= caption %>" class="<%=  classes %>">'
  };
  return templates;
});
