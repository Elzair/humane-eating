define(['javascripts/mvc', 'javascripts/haversine', 
    'javascripts/infobubble-compiled'], 
    function(mvc, haversine) {
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

  loc_v = new mvc.LocationView({
    model: null,
    el: null
  });


  var
  // Declare variable to hold Google Map
  map,

  // variable to hold Google Maps info window
  info_window,

  // Declare collection
  loc_c = new mvc.LocationCollection([]);

  // Add a marker for each new location and an event
  // listener to open an InfoBubble when the user clicks that marker
  loc_c.on('add', function(loc) {
    var self = this; // Store reference to Collection
    var loc_id = loc.id; // Store reference to location id
    var color = loc.get('color');
    var marker_pos = new google.maps.LatLng(loc.get('latitude'),loc.get('longitude'));

    // First create marker icon
    var icon = {
      path: 'M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z',
      scale: 1,
      fillOpacity: 1.0,
      fillColor: color,
      strokeColor: 'gray',
      strokeWeight: 0.5,
      size: new google.maps.Size(32, 32),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(16,0)
    };

    // Add marker to map
    var marker = new google.maps.Marker({
      position: marker_pos,
      icon: icon,
      draggable: false,
      map: map,
      animation: google.maps.Animation.DROP,
      title: loc.get('name')
    });

    // Triger InfoBubble to open when user clicks marker
    google.maps.event.addListener(marker, 'click', function(loc) {
      var loc_info = self.get(loc_id);
      var html = _.template(mvc.templates.infwin, loc_info.attributes);

      // Close info_window if it is already open
      if (info_window) {
        info_window.close();
      }
      info_window = new InfoBubble({
        content: html,
        hideCloseButton: true,
        arrowPosition: 15,
        arrowSize: 20,
        arrowStyle: 2,
        shadowStyle: 0,
        backgroundClassName: 'popup'
      });
      info_window.open(map, marker);
    });
  });

  // Instantiate router
  var app_router = new mvc.AppRouter();

  // Populate routes
  app_router.on('route:search', function(params) {
    var url = '/api/locations/search';
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
      // Set id attribute, distance and marker color of all locations
      var user_loc = coord_m.toJSON();
      for (i=0; i<data.length; i++) {
        if (data[i].hasOwnProperty('objectId')) {
          data[i].id = data[i].objectId;
          data[i].distance = haversine.distance(user_loc, data[i].location, true);
          switch(data[i].humanestatus) {
            case 'Vegan':
              data[i].color = '#006000';
              break;
            case 'Vegan-Friendly':
            case 'Vegetarian':
            case 'Vegetarian-Friendly':
              data[i].color = '#6ab93a';
              break;
            case 'Humane-Friendly':
              data[i].color = '#8b4513';
              break;
            case 'Watch List':
              data[i].color = '#c01a1d';
              break;
            default:
              data[i].color = '#f3aa24';
              break;
          }
        } 
      }

      // Add data to Location Collection
      loc_c.add(data);
    })
    .fail(function(err) {
      console.log(err);
    });
  });

  app_router.on('route:get_loc', function(id, name, params) {
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
    var center = new google.maps.LatLng(latitude, longitude);
    var map_options = {
      center: center,
      zoom: 10,
      disableDefaultUI: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), map_options);

    // Add event listener to call search route when the current location changes
    google.maps.event.addListener(map, 'center_changed', function() {
      var url = '/api/locations/search?lat=' + map.getCenter().lat() + 
                '&long=' + map.getCenter().lng();
      app_router.navigate(url, true);
    });

    // Get surrounding locations
    var url = '/api/locations/search?lat=' + latitude +
      '&long=' + longitude;
    app_router.navigate(url, true);

    // Add event listener to close open InfoBubble when user clicks outside it
    google.maps.event.addListener(map, 'click', function() {
      if (info_window) {
        info_window.close();
      }
    });
  }
 
  // This function creates a new Google Map at the user's current location.
  // If the Geolocation API is not available, it defaults to Los Angeles, CA USA.
  var initialize = function() {
    if (('geolocation' in navigator) === true) {
      navigator.geolocation.getCurrentPosition(function(position) {
        coord_m.set('latitude', position.coords.latitude);
        coord_m.set('longitude', position.coords.longitude); 
        init_gm(coord_m.get('latitude'), coord_m.get('longitude'));
      });
    }
    else {
      coord_m.set('latitude', 34.0522);
      coord_m.set('longitude', -118.2428);
      init_gm(coord_m.get('latitude'), coord_m.get('longitude'));
    }
  };

  // Start backbone's history module as soon as DOM finishes loading
  $(function() {
    Backbone.history.start();
  });

  // Return initialization function
  return { initialize: initialize };
});
