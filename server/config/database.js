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

exports.seed = function(app){
  var glob = require('glob');
  var colors = require('colors/safe');

  glob(__dirname + '/seeds/*.js', function(err, files){
    files.forEach(function(file){
      var seeder = require(file);
      var modelName = file.split('/').pop().replace('.js', '');
      var Model = app.models[modelName];
      if (!Model){
        console.log(colors.red('There is no model with the name %s'), modalName);
        throw Error('There is no model with that name');
      }
      console.log(colors.green.bold('Seeding %s'), modelName);
      console.log((colors.underline('============================')));
      Model.remove({})
      .then(function(){
        seeder.forEach(function(seed){
          var newModel = new Model(seed);
          newModel.save()
          .then(function(modelCreated){
            console.log(colors.green('seeded %s'), modelCreated);
          },function(err){
            console.log(colors.red('error seeding %s %s'), modelName, JSON.stringify(err));
          });
        });
      });
    });
  });
};
