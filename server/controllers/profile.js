'use strict';

module.exports = function(app){
  var User = app.models.User;
  return {

    /**
     * User Profile
     **/
    get: function(req, res){
      var userId = req.params.userId;
      User.findById(userId, function(err, usr){
        if (err){
          return res.sendStatus(500);
        }
        if (usr && (userId === usr._id.toString())){
          return res.json(usr.user_profile);
        } else if (usr){
          return res.json(usr.user_info);
        }
        return res.sendStatus(404);
      });
    }
  };
};
