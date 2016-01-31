'use strict';

module.exports = function(app) {
  var User = app.models.User;
  return {
  /**
   * Create user
   **/
    create : function(req, res, next){
      var newUser = new User();
      newUser.local.email = req.body.email;
      newUser.local.password = req.body.password;
      newUser.local.name = req.body.name;

      newUser.provider = 'local';

      newUser.save(function(err){
        if (err){
          return res.status(400).json(err);
        }
        req.logIn(newUser, function(err){
          if (err) {return next(err);}
          return res.json(newUser.user_info);
        });
      });
    },

    /**
     * Email exist
     */
    exist: function(req, res, next){
      var email = req.params.email;
      User.findOne({'local.email': email}, function(err, usr){
        if (err){
          return next(new Error('Faild to load user %s', email));
        }
        if (usr){
          return res.json({exist: true});
        } else {
          return res.json({exist: false});
        }
      });
    },

    info: function(req, res){
      var userId = req.params.userId;
      User.findById(userId, function(err, usr){
        if(err){
          return res.sendStatus(404);
        }

        return res.json(usr.user_details);
      })
    }

  };
};
