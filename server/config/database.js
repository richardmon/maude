'use strict';

var mongoose = require('mongoose');
var config = require('./index');

exports.mongoose = mongoose;

var mongoOptions = {db: {safe : true}};

exports.db = mongoose.connect(config.db, mongoOptions, function(err, res){
  if (err){
    console.log('ERROR connect to ' + config.db, err);
  } else {
    console.log('Succesfully conected to ' + config.db);
  }
});
