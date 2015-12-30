'use strict';

module.exports = function(app){

  // User
  var user = app.controllers.User;
  app.post('/user', user.create);
  app.get('/user/check_email/:email', user.exist);

  //Session
  var session = app.controllers.Session;
  app.post('/auth/login', session.login);
  app.delete('/auth/logout', session.logout);

};
