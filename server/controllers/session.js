
'use strict';

module.exports = function(app) {
  var passport = require('passport');
  return {
  /**
   * login user
   **/
    login : function(req, res, next){
      passport.authenticate('local', function(err, user, info){
        var error = err || info;
        if (error){
          return res.status(400).json(error);
        }
        req.logIn(user, function(err){
          if (err){
            return res.send(err);
          }
          return res.json(user.user_info);
        });
      })(req, res, next);
    },

    /**
     * logout user
     */
    logout : function(req, res){
      if (!req.user){
        return res.status(400).json({message: 'Not logged in'});
      }
      req.logout();
      return res.sendStatus(200);
    },

    /**
     * Returns user information
     */
    session: function(req, res){
      if (req.user){
        return res.json(req.user.user_info);
      }
    }
  };
};
