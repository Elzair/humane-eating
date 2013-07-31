define(['javascripts/mvc'], function(mvc) {
  var 
  title_m = new mvc.TitleModel({title: 'Humane Eating'}),
  img_m = new mvc.ImageModel({
    src: '/images/america_for_animals_60x60.png',
    caption: 'America For Animals logo',
    hidden: false
  }),
  coord_m = new mvc.CoordinatesModel({}),
  //loc_m = new mvc.LocationModel({}),
  title_v = new mvc.TitleView({
    model: title_m, 
    el: '#title'
  }),
  img_v = new mvc.ImageView({
    model: img_m,
    el: '#logo'
  }),
  
  // Declare variable to hold Google Map
  map,

  // variable to hold Google Maps info window
  info_window,

  // Declare collection
  loc_c = new mvc.LocationCollection([]);

  loc_c.on('add', function(loc) {
    console.log('Got here: '+JSON.stringify(loc));
    var marker_pos = new google.maps.LatLng(loc.get('latitude'),loc.get('longitude'));
    var marker = new google.maps.Marker({
      position: marker_pos,
      map: map,
      title: loc.get('name')
    });
    google.maps.event.addListener(marker, 'click', function() {
      info_window = new google.maps.InfoWindow({
        content: _.template(mvc.templates.infwin, loc)
      });
    });
  });

  // Instantiate router
  var app_router = new mvc.AppRouter();

  // Populate routes
  app_router.on('route:search', function(params) {
    var url = '/api/locations/search';
    if (params !== undefined) {
      //console.log(JSON.stringify(params));
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
      //var results = JSON.parse(data);
      loc_c.add(data.locations);
      //console.log(JSON.stringify(loc_c));
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

  // This function creates a new Google Map at the given coordinates.
  function init_gm(latitude, longitude) {
    var map_options = {
      center: new google.maps.LatLng(latitude, longitude),
      zoom: 9,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), map_options);

    // Get surrounding locations
    var url = '/api/locations/search?lat=' + latitude +
      '&long=' + longitude;
    app_router.navigate(url, true);
  }
 
  // This function creates a new Google Map at the user's current location 
  var initialize = function() {
    navigator.geolocation.getCurrentPosition(function(position) {
      coord_m.set('latitude', position.coords.latitude);
      coord_m.set('longitude', position.coords.longitude); 
      //console.log(coord_m.get('latitude')+' '+coord_m.get('longitude'));
      init_gm(coord_m.get('latitude'), coord_m.get('longitude'));
    });
  };

  // Start backbone's history module as soon as DOM finishes loading
  $(function() {
    Backbone.history.start();
  });

  // Return initialization function
  return { initialize: initialize };
});
