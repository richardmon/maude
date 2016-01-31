'use strict';


var express = require('express');
var app = express();
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var path = require('path');
var errorHandler = require('errorhandler');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('./server/config');



//Models
app.models = require('./server/models');
//Controlers
app.controllers = require('./server/controllers')(app);



//Connect dbs
require('./server/config/database').db;

//Passport
require('./server/config/pass')(app);

// App Configuration
if (app.get('env') === 'test') {
  app.use(express.static(path.join(__dirname, 'client')));
  app.use(errorHandler());
  app.set('views', __dirname + '/client');
  require('./server/config/database').seed(app);
};

if (app.get('env') === 'development') {
  app.use(express.static(path.join(__dirname, 'client')));
  app.use(errorHandler());
  app.set('views', __dirname + '/client');
};

if (app.get('env') === 'production'){
  app.use(express.static(path.join(__dirname, 'dist')));
  app.set('views', __dirname + '/dist');
};

// should be above session
app.use(cookieParser());

// bodyParser should be above methodOverride
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());

//session
app.use(session({
  secret : 'MAUDE',
  store: new MongoStore({
    url: config.db,
    collection: 'sessions'
  })
}));

// use passport session
app.use(passport.initialize());
app.use(passport.session());

//Routing
require('./server/config/routes')(app);

//Connect
var port = process.env.PORT || config.port;
app.listen(port, function () {
  console.log('Express server listening on port %d in %s mode', port, app.get('env'));
});
