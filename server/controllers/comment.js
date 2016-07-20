'use strict';

module.exports = function(app){
  var Comment = app.models.Comment;

  return {
    /**
     * Creates a new comment
     **/
    create: function(req, res){
      var newComment = new Comment();
      newComment.creator = req.body.creator;
      newComment.title = req.body.title;
      newComment.content = req.body.content;

      var replies = req.body.replies || [];
      newComment.replies = replies.slice();


      newComment.save(function(err){
        if (err){
          return res.status(400).json(err);
        }
        return res.json(newComment);
      });
    },

    /**
     * Returns comment based on id
     **/
    get: function(req, res){
      var commentId = req.params.commentId;
      Comment.findById(commentId, function(err, comment){
        if (err){
          return res.sendStatus(404);
        }
        return res.json(comment);
      });
    },

    // /**
    //  * Search for pins matching the query
    //  **/
    // searchPins: function(req, res){
    //   var Lat = req.query.Lat;
    //   var Lng = req.query.Lng;

    //   Pin.find({
    //     $and: [
    //       {'location.Lat': Lat},
    //       {'location.Lng': Lng}
    //     ]
    //   }, function(err, pins){
    //     return res.json(pins);
    //   });
    // }
  };
};
