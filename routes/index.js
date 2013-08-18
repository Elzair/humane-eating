var http = require('http')
  , https = require('https')
  , parse = require('parse').Parse
  , fs = require('fs')
  , util = require('util')
  ;
/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index', { title: 'Humane Eating' });
};

exports.location = function(req, res) {
  var obj_id = req.params.hasOwnProperty('id') ? req.params.id : null;
  console.log(obj_id);

  parse.initialize(global.app_id, global.js_key);
  var restaurants = parse.Object.extend('Restaurants');
  var query = new parse.Query(restaurants);
  query.equalTo('objectId', obj_id);
  query.first().then(
    function(results) {
      console.log(util.format('%j', results));
      res.json(200, results);
    },
    function(err) {
      console.error(util.format('%j', err));
      res.json(500, err);
    }
  );
};

exports.search = function(req, res) {
  var curr_loc = null;
  if (req.query.hasOwnProperty('lat') && req.query.hasOwnProperty('long')) {
    curr_loc = new parse.GeoPoint({
      latitude: parseFloat(req.query.lat), 
      longitude: parseFloat(req.query.long)
    });
  }
  else {
    curr_loc = new parse.GeoPoint({
      latitude: 0.0, 
      longitude: 0.0
    });
  }

  var constraints = {}, q = null, c = null;
  for (q in req.query) {
    if (req.query.hasOwnProperty(q) && (
        q === 'humanestatus' ||
        q === 'cuisines' ||
        q === 'iswheelchairaccessible' ||
        q === 'allowssmoking')) {
      constraints[q] = req.query[q];
    }
  }

  parse.initialize(global.app_id, global.js_key);
  var restaurants = parse.Object.extend('Restaurants');
  var query = new parse.Query(restaurants);
  
  for (c in constraints) {
    if (constraints.hasOwnProperty(c)) {
      query.equalTo(c, constraints[c]);
    }
  }
  query.limit(10);
  query.near('location', curr_loc);
  query.select('name', 'cuisines', 'address1', 'address2', 'city', 'region',
      'postalcode', 'country', 'humanestatus', 'location', 'latitude', 
      'longitude', 'issue1');
  query.find().then(
    function (results) {
      console.log(util.format('%j', results));
      res.json(200, results);
    },
    function (err) {
      console.error(util.format('Error: %j', err));
      res.send(500, JSON.stringify(err));
    }
  );
};
