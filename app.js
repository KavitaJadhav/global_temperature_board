var express = require('express');
// var routes = require('./routes');
// var index = require('./routes/index');
// var user = require('./routes/user');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var presenter = require('./presenter').presenter;

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'jade');
// app.use(express.favicon());
// app.use(express.logger('dev'));
app.use(bodyParser.json());
// app.use(express.urlencoded());
// app.use(express.methodOverride());
app.get('/', presenter.home);
app.get('/lineGraph', presenter.lineGraph);

// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
// }


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
