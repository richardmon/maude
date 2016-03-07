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
    name: {type: String, required: true},
    Lat: {type: String, required: true},
    Lng: {type: String, required: true}
  }],
  images: [String],
  available: Boolean
});

/**
 * validations
 **/
Pin.path('images').validate(function(images){
  var minLength = 1;
  return images.length >= minLength;
}, 'Your pin should contain at least one picture');

Pin.path('images').validate(function(images){
  var maxLength = 4;
  return images.length <= maxLength;
}, 'Your pin should not contain more than four pictures');

Pin.path('location').validate(function(location){
  return location && location.length;
}, 'One location must be given');

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
