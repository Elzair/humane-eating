define(['jquery', 'backbone', 'underscore'], 
    function($, Backbone, _) {
  // Define the underscore templates used to render the views
  var templates = {
    title: '<%= title %>',
    image: '<img src="<%= src %>" alt="<%= caption %>" class="<%=  classes %>">'
  },

  // Define models
  TitleModel = Backbone.Model.extend({
    defaults: {
      title: 'Humane Eating',
    },
    initialize: function() {}
  }),
  ImageModel = Backbone.Model.extend({
    defaults: {
      src: '',
      caption: '',
      classes: '',
      hidden: true
    },
    initialize: function() {}
  }),
  CoordinatesModel = Backbone.Model.extend({
    defaults: {
      latitude: 0.0,
      longitude: 0.0
    },
    initialize: function() {}
  }),
  LocationModel = Backbone.Model.extend({
    initialize: function() {}
  }),
  SearchModel = Backbone.Model.extend({
    defaults: {
      text: ''
    },
    initialize: function() {}
  }),

  // Define views
  TitleView = Backbone.View.extend({
    template: templates.title,
    initialize: function() {
      this.render();
    },
    render: function() {
      var html = _.template(this.template, this.model.toJSON());
      $(this.el).html(html);
      return this;
    }
  }),
  ImageView = Backbone.View.extend({
    template: templates.image,
    initialize: function() {
      this.render();
    },
    render: function() {
      this.model.set({classes: this.model.get('hidden') ? 'hidden' : ''});
      var html = _.template(this.template, this.model.toJSON());
      $(this.el).html(html);
      return this;
    }
  });

  // Return constructors for models and views
  return {
    TitleModel: TitleModel,
    ImageModel: ImageModel,
    CoordinatesModel: CoordinatesModel,
    LocationModel: LocationModel,
    TitleView: TitleView,
    ImageView: ImageView
  };
});
