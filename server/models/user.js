'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto')

var User = new Schema({
  picture: String,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: String,
  salt: String,
  provider: String
});

/**
 *Virtuals
 **/

// User.virtual('_password')
//   .set(function(_password){
//     this._passwd = _password;
//     this.salt = this.makeSalt();
//     this.password = this.encryptPassword(_password);
//   });

User.path('password')
  .set(function(_password){
    this._passwd = _password;
    this.salt = this.makeSalt();
    return this.encryptPassword(_password);
  });


User.virtual('user_info')
.get(function(){
  return {'_id': this._id, 'name': this.name, 'email': this.email };
});

/**
 *Validate
 **/

var notNull = function(value){
  return value && value.length;
}

User.path('email').validate(function (email) {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
}, 'The given email is invalid.');

User.path('email').validate(function(value, respond) {
  mongoose.models["User"].findOne({email: value}, function(err, user) {
    if(err) throw err;
    if(user) return respond(false);
    respond(true);
  });
}, 'The given email address is already in use.');

/**
 * Methods
 **/
User.methods.validPassword = function(passwd){
  return this.encryptPassword(passwd) === this.password;
};

User.methods.encryptPassword = function(passwd){
  if(!passwd || !this.salt) return '';
  var salt = new Buffer(this.salt, 'base64');
  return crypto.pbkdf2Sync(passwd, salt, 1000, 64).toString('base64');
}

User.methods.makeSalt = function(){
  return crypto.randomBytes(16).toString('base64');
}

/**
 * pre-save
 **/
User.pre('save', function(next) {
  if (!this.isNew) {
    return next();
  }

  if (notNull(this.password)) {
    next();
  }
  next(new Error('Invalid password'));
});


module.exports = mongoose.model('User', User);
