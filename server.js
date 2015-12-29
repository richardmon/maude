'use strict';


var app = require('express')();
var passport = require('passport');
var config = require('./server/config');

//Models
app.models = require('./server/models');

//Connect dbs
var db = require('./server/config/database').db;
