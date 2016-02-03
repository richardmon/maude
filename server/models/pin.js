'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Pin = new Schema({
  creator: {
    requered: true,
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title:{
    type: String,
    requered: true
  },
  created: Date,
  content: String,
  location: [{
    Lat: String,
    Lng: String
  }],
  available: Boolean
});


/**
 * pre-save
 **/
Pin.pre('save', function(next){
  if (!this.isNew){
    return next();
  }

  this.created = Date.now();
  next();
});

module.exports = mongoose.model('Pin', Pin);
