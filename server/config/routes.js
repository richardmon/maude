'use strict';

module.exports = function(app){
  var passport = require('passport');

  // User
  var user = app.controllers.User;
  app.post('/user', user.create);
  app.get('/user/check_email/:email', user.exist);
  app.get('/user/:userId', user.info);

  //Session
  var session = app.controllers.Session;
  app.get('/auth/session', isLoggeIn, session.session);
  app.post('/auth/session', session.login);
  app.delete('/auth/session', session.logout);

  //Facebook
  app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
  app.get('/auth/facebook/callback',
      passport.authenticate('facebook',{
        successRedirect : '/',
        failureRedirect : '/'
      }));

  //Twitter
  app.get('/auth/twitter', passport.authenticate('twitter'));
  app.get('/auth/twitter/callback',
      passport.authenticate('twitter', {
        successRedirect : '/',
        failureRedirect : '/'
      }));

  // Pins
  var pin = app.controllers.Pin;
  app.post('/pin', isLoggeIn,  pin.create);
  app.get('/pin/:pinId', pin.getPin);
  app.get('/pins', pin.searchPins);

  app.get('/*', function(req, res){
    if (req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }

    return res.sendFile('index.html');
  });
};

function isLoggeIn(req, res, next){
  if (req.isAuthenticated()){
    return next();
  }
  res.sendStatus(401);
}
