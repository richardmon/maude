'use strict';

module.exports = function(app){
  var passport = require('passport');
  var multer = require('multer');

  var crypto = require('crypto');
  var path = require('path');
  var storage = multer.diskStorage({ // will setup the name with the proper file extention
    destination: './client/uploads',
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(null, raw.toString('hex') + Date.now() + path.extname(file.originalname));
      });
    }
  });
  var upload = multer({storage: storage});

  // User
  var user = app.controllers.user;
  app.post('/user', user.create);
  app.get('/user/check_email/:email', user.exist);
  app.get('/user/:userId', user.info);

  // Profile
  var profile = app.controllers.profile;
  app.get('/profile/:userId', profile.get);

  //Session
  var session = app.controllers.session;
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
  var pin = app.controllers.pin;
  app.post('/pin', isLoggeIn, upload.array('images'),  pin.create);
  app.get('/pin/:pinId', pin.getPin);
  app.get('/pins', pin.searchPins);

  //Comments
  var comment = app.controllers.comment;
  app.post('/comment', isLoggeIn, comment.create);

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
