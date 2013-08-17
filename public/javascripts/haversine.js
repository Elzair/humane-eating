define([], function() {
  var distance = function() {
    var p1 = arguments[0]
      , p2 = arguments[1]
      , use_miles = arguments[2] || false
      , KM2MI = 1.60934
      , DEG2RAD = Math.PI / 180.0
      , RAD2DEG = 180.0 / Math.PI
      , R = 6371 // Radius of the Earth (in km)
      , dlat = (p2.latitude - p1.latitude)*DEG2RAD
      , dlon = (p2.longitude - p1.longitude)*DEG2RAD
      , lat1 = p1.latitude*DEG2RAD
      , lat2 = p2.latitude*DEG2RAD;
    //console.log(p1.latitude.toString()+' '+p1.longitude.toString()+' '+p2.latitude.toString()+' '+p2.longitude.toString());
    //console.log(R.toString()+' '+dlat.toString()+' '+dlon.toString()+' '+lat1.toString()+' '+lat2.toString()); 
    var a = Math.sin(dlat/2)*Math.sin(dlat/2) + 
            Math.sin(dlon/2)*Math.sin(dlon/2)*Math.cos(lat1)*Math.cos(lat2);
    var c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = use_miles ? R*c*KM2MI : R*c;
    //var d = R*c;
    //console.log(a.toString()+' '+c.toString()+' '+d.toString());
    return d.toPrecision(2);
  };

  return {
    distance: distance
  };
});
