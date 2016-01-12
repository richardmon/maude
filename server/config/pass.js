'use strict';


module.exports = function(app){
  var passport = require('passport');
  var LocalStrategy = require('passport-local');
  var FacebookStrategy = require('passport-facebook');
  var auth = require('./auth')
  var User = app.models.User;

  //Serialize session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


  // Use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({ 'local.email': email }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            'errors': {
              'email': { type: 'Email is not registered.' }
            }
          });
        }
        if (!user.validPassword(password)) {
          return done(null, false, {
            'errors': {
              'password': { type: 'Password is incorrect.' }
            }
          });
        }
        return done(null, user);
      });
    }
  ));

  //Facebook startegy
  passport.use(new FacebookStrategy({
    clientID: auth.facebookAuth.clientID,
    clientSecret: auth.facebookAuth.clientSecret,
    callbackURL: auth.facebookAuth.callbackURL,
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
  }, function(token, refreshToken, profile, done){
    User.findOne( {'facebook.id': profile.id}, function(err, user){
      if(err){
        return done(err);
      }
      if(user){
        return done(null, user);
      }

      var newUser = new User();
      newUser.facebook.id = profile.id;
      newUser.facebook.token = token;
      newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
      newUser.facebook.email = profile.emails[0].value;
      newUser.provider = 'facebook';

      newUser.save(function(err){
        if(err){
          return done(err);
        }
        return done(null, newUser);
      });

    })

  }
  ));
}
