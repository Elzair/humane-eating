define(['javascripts/mvc'], function(mvc) {
  navigator.geolocation.getCurrentPosition(function(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    console.log(latitude+" "+longitude);
  });
  var 
  title_m = new mvc.TitleModel({title: 'Humane Eating'}),
  img_m = new mvc.ImageModel({
    src: '/images/america_for_animals_60x60.png',
    caption: 'America For Animals logo',
    hidden: false
  }),
  coord_m = new mvc.CoordinatesModel({}),
  loc_m = new mvc.LocationModel({}),
  title_v = new mvc.TitleView({
    model: title_m, 
    el: '#title'
  }),
  img_v = new mvc.ImageView({
    model: img_m,
    el: '#logo'
  });
  function init_gm() {
    var map_options = {
      center: new google.maps.LatLng(-34.397, 150.644),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), map_options);
  }
  return { init_gm: init_gm };
});
