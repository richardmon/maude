'use strict';

module.exports = function(app){
  var passport = require('passport');

  // User
  var user = app.controllers.User;
  app.post('/user', user.create);
  app.get('/user/check_email/:email', user.exist);

  //Session
  var session = app.controllers.Session;
  app.post('/auth/session', session.login);
  app.delete('/auth/session', session.logout);

  //Facebook
  app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
  app.get('/auth/facebook/callback',
      passport.authenticate('facebook',{
        successRedirect : '/',
        failureRedirect : '/'
      }));

  app.get('/*', function(req, res){
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }

    return res.sendFile('index.html');
  });
};

function isLoggeIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.send("err");
}
