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

//exports.location = function(req, res) {
//  // Make sure query has parameter 'json'
//  var queries = req.query, arr = [], q = null;
//  queries.json = 'locationInfo';
//  for (q in queries) {
//    if (queries.hasOwnProperty(q)) {
//      arr.push(util.format('%s=%s',q, queries[q]));
//    }
//  }
//  var path = util.format('%s?%s', req.path, arr.join('&'));
//  console.log(path);
//  var options = {
//    hostname: 'dev.vegtable.co',
//    path: path
//  };
//  // Make remote request to http://vegetable.co and return results
//  http.request(options, function(resp) {
//    console.log('%s %s', resp.statusCode, JSON.stringify(resp.headers));
//    resp.setEncoding('utf8');
//    var data = '';
//    resp.on('data', function(chunk) {
//      data += chunk;
//    });
//    resp.on('end', function() {
//      // These are a bunch of ugly hacks to fix errors in the
//      // JSON returned by the server. 
//      info = data.replace(/locationInfo\ =/g, '');
//      info = info.replace(/\"logoId\":,/g, '"logoId":null,');
//      info = info.replace(/\"lastEditUserId\":1/g, '"lastEditUserId":1,');
//      info = info.replace(/\"distance\":,/g, '"distance":0,');
//      info = info.replace(/\};/g, '}');
//      res.json(resp.statusCode, JSON.parse(info)).end();
//    });
//  }) 
//  .on('error', function(err) {
//    console.log('Something went wrong!');
//    res.send(500, JSON.stringify(err));
//  })
//  .end();
//};

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
  //console.log(util.format('%j', curr_loc));

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
  query.limit(2);
  query.near('location', curr_loc);
  query.select('name', 'cuisines', 'address1', 'address2', 'city', 'region',
      'postalcode', 'country', 'phone', 'homepage', 'humanestatus', 
      'location', 'latitude', 'longitude');
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

//exports.search = function(req, res) {
//  //res.send(200, "Hello!").end();
//  // Make sure query has parameter 'json'
//  var queries = req.query, arr = [], q = null;
//  queries.json = 'locationInfo';
//  for (q in queries) {
//    if (queries.hasOwnProperty(q)) {
//      arr.push(util.format('%s=%s',q, queries[q]));
//    }
//  }
//  var path = util.format('%s?%s', req.path, arr.join('&'));
//  console.log(path);
//  var options = {
//    hostname: 'dev.vegtable.co',
//    path: path
//  };
//  // Make remote request to http://vegetable.co and return results
//  http.request(options, function(resp) {
//    console.log('%s %s', resp.statusCode, JSON.stringify(resp.headers));
//    resp.setEncoding('utf8');
//    var data = '';
//    resp.on('data', function(chunk) {
//      data += chunk;
//    });
//    resp.on('end', function() {
//      // These are a bunch of ugly hacks to fix errors in the
//      // JSON returned by the server. 
//      info = data.replace(/locationInfo\ =/g, '');
//      info = info.replace(/\"logoId\":,/g, '"logoId":null,');
//      //info = info.replace(/\"lastEditUserId\":1/g, '"lastEditUserId":1,');
//      //info = info.replace(/\"distance\":,/g, '"distance":0,');
//      info = info.replace(/\};/g, '}');
//      res.json(resp.statusCode, JSON.parse(info)).end();
//    });
//  }) 
//  .on('error', function(err) {
//    console.log('Something went wrong!');
//    res.send(500, JSON.stringify(err));
//  })
//  .end();
//};

var getter = (function(p, f) {
  var pa = p,
  fs = f,
  restaurants = null,
  //results = null,
  init = function() {
    pa.initialize(global.app_id, global.js_key);
    restaurants = pa.Object.extend('Restaurants');
    //results = [];
    fs.writeFileSync('test.json', '[');
  },
  get_all = function(cb) {
    init();
    get_rec(0, cb);
  },
  get_rec = function(num_skip, cb) {
    var query = new pa.Query(restaurants).notEqualTo('latitude', null).notEqualTo('longitude', null).limit(1000).skip(num_skip).find();
    query.then(
      function(data) {
        if (num_skip > 0) {
          fs.appendFileSync('test.json', ',');
        }
        //results = results.concat(JSON.parse(util.format('%j', data)));
        var results = JSON.parse(util.format('%j', data));
        var out = [];
        for (i=0; i<results.length; i++) {
          var r = [], rr = [], j = null;
          r.push('\t{');
          for (j in results[i]) {
            if (results[i].hasOwnProperty(j)) {
              rr.push(util.format('\t\t"%s": %j', j, results[i][j]));
            }
          }
          r.push(rr.join(',\n'));
          r.push('\t}');
          //var r = util.format('\t%j,', results[i]).split('\n').join('\n\t\t');
          out.push(r.join('\n'));
        }
        fs.appendFileSync('test.json', out.join(',\n'));
        //console.log(util.format('%j', results));
        get_rec(num_skip+1000, cb);
      },
      function(err) {
        fs.appendFileSync('test.json', ']');
        //var out = results;
        //console.log(util.format('%j', out));
        cb('{"done": true}');
      }
    );
  };
  return {
    get_all: get_all
  };
}(parse, fs));

exports.all = function(req, res) {
  getter.get_all(function(out) {
    console.log(util.format('%j', out));
    res.json(200, out);
  });
}
