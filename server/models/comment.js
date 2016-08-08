'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
  creator:{
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  content: String,
  replies: [{
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

module.exports = mongoose.model('Comment', Comment);
