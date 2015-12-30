'use strict';


module.exports = function(app){
  var passport = require('passport');
  var LocalStrategy = require('passport-local');
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
      User.findOne({ email: email }, function (err, user) {
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
}
