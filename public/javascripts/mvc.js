define(['jquery', 'backbone-query-parameters', 
    'backbone', 'underscore'], function($, qp, Backbone, _) {
  // Define the underscore templates used to render the views
  var templates = {
    title: '<%= title %>',
    image: '<img src="<%= src %>" alt="<%= caption %>" class="<%=  classes %>">',
    infwin: '<div id="content"><div class="siteNotice"><p style="color: <%= color %>"><%= humanestatus %>' +
            '</p></div><h2 id="firstHeading" class="firstHeading"><%= name %></h2><div id="bodyContent">' +
            '<p><%= address1 %> <%= address2 %></p><p><%= city %>, <%= region %>, <%= country %></p>' +
            '<p><%= distance %> miles</p></div>'
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

  // Define collections
  CoordinatesCollection = Backbone.Collection.extend({
    model: CoordinatesModel
  }),
  LocationCollection = Backbone.Collection.extend({
    model: LocationModel
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
  }),
  LocationView = Backbone.View.extend({
    template: templates.infwin,
    initialize: function() {},
    render: function() {
      var html = _.template(this.template, this.model.toJSON());
      return html;
    }
  }),

  // Define routes
  AppRouter = Backbone.Router.extend({
    routes: {
      'api/locations/search': 'search',
      'api/locations/:id': 'get_loc',
      '*actions': 'default_route'
    }
  });


  // Return constructors for models and views
  return {
    templates: templates,
    TitleModel: TitleModel,
    ImageModel: ImageModel,
    CoordinatesModel: CoordinatesModel,
    LocationModel: LocationModel,
    CoordinatesCollection: CoordinatesCollection,
    LocationCollection: LocationCollection,
    TitleView: TitleView,
    ImageView: ImageView,
    LocationView: LocationView,
    AppRouter: AppRouter
  };
});
