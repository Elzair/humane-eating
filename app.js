
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

app_id = '';
js_key = '';

// Read in ApplicationID and JavascriptKey for Parse platform
var parse_info = JSON.parse(fs.readFileSync('conf/parse.json')); 
app_id = parse_info.hasOwnProperty('app_id') ? parse_info.app_id : '';
js_key = parse_info.hasOwnProperty('js_key') ? parse_info.js_key : '';

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon('public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
  app.locals.pretty = true;
}

app.get('/', routes.index);
app.get('/api/locations/search', routes.search);
app.get('/api/locations/:id', routes.location);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
