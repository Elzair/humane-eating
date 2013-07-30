define(['jquery', 'backbone-query-parameters', 'backbone', 'underscore'], 
    function($, qp, Backbone, _) {
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
  }),

  // Define routes
  AppRouter = Backbone.Router.extend({
    routes: {
      'api/locations/search': 'search',
      'api/locations/:id': 'get_loc',
      '*actions': 'default_route'
    }
  });

  // Instantiate route
  var app_router = new AppRouter();

  // Populate routes
  app_router.on('route:search', function(params) {
    var url = '/api/locations/search';
    if (params !== undefined) {
      console.log(JSON.stringify(params));
      var queries = [];
      var p;
      for (p in params) {
        if (params.hasOwnProperty(p)) {
          queries.push(p+'='+params[p]);
        }
      }
      url = url + '?' + queries.join('&');
    }
    $.getJSON(url)
    .done(function(data) {
      console.log(JSON.stringify(data));
    })
    .fail(function(err) {
      console.log(err);
    });
  });

  app_router.on('route:get_loc', function(id, name, params) {
    console.log('You got here!');
    var url = '/api/locations/'+id;
    if (params !== undefined) {
      var queries = [];
      var p;
      for (p in params) {
        if (params.hasOwnProperty(p)) {
          queries.push(p+'='+params[p]);
        }
      }
      url = url + '?' + queries.join('&');
    }
    $.getJSON(url)
    .done(function(data) {
      console.log(JSON.stringify(data));
    })
    .fail(function(err) {
      console.log(err);
    });    
  });
  
  // Start backbone's history module
  Backbone.history.start();

  // Return constructors for models and views
  return {
    TitleModel: TitleModel,
    ImageModel: ImageModel,
    CoordinatesModel: CoordinatesModel,
    LocationModel: LocationModel,
    TitleView: TitleView,
    ImageView: ImageView,
    app_router: app_router
  };
});
