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

  app.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }

    return res.sendFile('index.html');
  });
};
