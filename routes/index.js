var http = require('http')
  , util = require('util')
  ;
/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index', { title: 'Express' });
};

exports.location = function(req, res) {
  // Make sure query has parameter 'json'
  var queries = req.query, arr = [], q = null;
  queries.json = 'locationInfo';
  for (q in queries) {
    if (queries.hasOwnProperty(q)) {
      arr.push(util.format('%s=%s',q, queries[q]));
    }
  }
  var path = util.format('%s?%s', req.path, arr.join('&'));
  console.log(path);
  var options = {
    hostname: 'dev.vegtable.co',
    path: path
  };
  // Make remote request to http://vegetable.co and return results
  http.request(options, function(resp) {
    console.log('%s %s', resp.statusCode, JSON.stringify(resp.headers));
    resp.setEncoding('utf8');
    var data = '';
    resp.on('data', function(chunk) {
      data += chunk;
    });
    resp.on('end', function() {
      // These are a bunch of ugly hacks to fix errors in the
      // JSON returned by the server. 
      info = data.replace(/locationInfo\ =/g, '');
      info = info.replace(/\"logoId\":,/g, '"logoId":null,');
      info = info.replace(/\"lastEditUserId\":1/g, '"lastEditUserId":1,');
      info = info.replace(/\"distance\":,/g, '"distance":0,');
      info = info.replace(/\};/g, '}');
      res.json(resp.statusCode, JSON.parse(info)).end();
    });
  }) 
  .on('error', function(err) {
    console.log('Something went wrong!');
    res.send(500, JSON.stringify(err));
  })
  .end();
};

exports.search = function(req, res) {
  //res.send(200, "Hello!").end();
  // Make sure query has parameter 'json'
  var queries = req.query, arr = [], q = null;
  queries.json = 'locationInfo';
  for (q in queries) {
    if (queries.hasOwnProperty(q)) {
      arr.push(util.format('%s=%s',q, queries[q]));
    }
  }
  var path = util.format('%s?%s', req.path, arr.join('&'));
  console.log(path);
  var options = {
    hostname: 'dev.vegtable.co',
    path: path
  };
  // Make remote request to http://vegetable.co and return results
  http.request(options, function(resp) {
    console.log('%s %s', resp.statusCode, JSON.stringify(resp.headers));
    resp.setEncoding('utf8');
    var data = '';
    resp.on('data', function(chunk) {
      data += chunk;
    });
    resp.on('end', function() {
      // These are a bunch of ugly hacks to fix errors in the
      // JSON returned by the server. 
      info = data.replace(/locationInfo\ =/g, '');
      info = info.replace(/\"logoId\":,/g, '"logoId":null,');
      //info = info.replace(/\"lastEditUserId\":1/g, '"lastEditUserId":1,');
      //info = info.replace(/\"distance\":,/g, '"distance":0,');
      info = info.replace(/\};/g, '}');
      res.json(resp.statusCode, JSON.parse(info)).end();
    });
  }) 
  .on('error', function(err) {
    console.log('Something went wrong!');
    res.send(500, JSON.stringify(err));
  })
  .end();
};
