'use strict';

module.exports = function(app) {
  var User = app.models.User;
  return {
  /**
   * Create user
   **/
    create : function(req, res, next){
      var newUser = new User();
      newUser.local = req.body;
      newUser.provider = 'local';

      newUser.save(function(err){
        if(err){
          return res.status(400).json(err);
        }
        req.logIn(newUser, function(err){
          if(err) return next(err);
          return res.json(newUser.user_info);
        });
      })
    },

    /**
     * Email exist
     */
    exist: function(req, res, next){
      var email = req.params.email;
      User.findOne({'local.email': email}, function(err, usr){
        if(err)
          return next(new Error("Faild to load user %s", email));

        if(usr){
          res.json({exist: true});
        }else{
          res.json({exist: false});
        }
      });
    },

  }
}
