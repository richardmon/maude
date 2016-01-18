'use strict';


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto')

var User = new Schema({
  picture: String,
  local: {
    email: String,
    password: String,
    salt: String,
    name: String,
  },

  facebook: {
    id: String,
    token: String,
    name: String,
    email: String,
  },

  twitter: {
    id: String,
    token: String,
    name: String,
  },
  provider: String
});

/**
 *Virtuals
 **/

User.path('local.password')
  .set(function(_password){
    this.local.salt = this.makeSalt();
    return this.encryptPassword(_password);
  });


User.virtual('user_info')
.get(function(){
  return {'_id': this._id, 'name': this[this.provider].name, 'email': this[this.provider].email };
});

/**
 *Validate
 **/

var notNull = function(value){
  return value && value.length;
}

User.path('local.email').validate(function (email) {
  var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
}, 'The given email is invalid.');

User.path('local.email').validate(function(value, respond) {
  mongoose.models["User"].findOne({'local.email': value}, function(err, user) {
    if(err) throw err;
    if(user) return respond(false);
    respond(true);
  });
}, 'The given email address is already in use.');

User.path('facebook.id').validate(function(id, respond) {
  mongoose.models["User"].findOne({'facebook.id': id}, function(err, user) {
    if(err) throw err;
    if(user) return respond(false);
    respond(true);
  });
}, 'The facebook ID is already in use.');

User.path('twitter.id').validate(function(id, respond) {
  mongoose.models["User"].findOne({'twitter.id': id}, function(err, user) {
    if(err) throw err;
    if(user) return respond(false);
    respond(true);
  });
}, 'The twitter ID is already in use.');

/**
 * Methods
 **/
User.methods.validPassword = function(passwd){
  return this.encryptPassword(passwd) === this.local.password;
};

User.methods.encryptPassword = function(passwd){
  if(!passwd || !this.local.salt) return '';
  var salt = new Buffer(this.local.salt, 'base64');
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

  if(this.provider === 'local'){
    if (notNull(this.local.password)) {
      next();
    }
    next(new Error('Invalid password'));
  }
  next();
});


module.exports = mongoose.model('User', User);
