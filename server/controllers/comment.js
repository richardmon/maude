'use strict';

module.exports = function(app){
  var Comment = app.models.Comment;

  return {
    /**
     * Creates a new comment
     * Requires Auth user
     **/
    create: function(req, res){
      var newComment = new Comment();
      newComment.creator = req.user._id;
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

    /**
     * Update the content of a comment
     **/
    update: function(req, res){
      var commentId = req.params.commentId;
      Comment.findById(commentId, function(err, comment){
        if (err){
          return res.sendStatus(404);
        }
        if (req.user && req.user._id && comment.creator.equals(req.user._id)){
          var content = req.body.content || '';
          comment.content = content;

          comment.save(function(err, commentNewContent){
            if (err){
              return res.status(400).json(err);
            }
            return res.json(commentNewContent);
          });
        } else {
          return res.json(comment);
        }
      });
    },

    /**
     * Deletes a comment
     **/
    delete: function(req, res){
      var commentId = req.params.commentId;
      Comment.findById(commentId, function(err, comment){
        if (err){
          return res.status(401).json(err);
        }
        if (req.user && req.user._id && comment.creator.equals(req.user._id)){
          Comment.remove({_id: commentId}, function(err, result){
            if (err){
              return res.sendStatus(401);
            }
            return res.sendStatus(200);
          });
        } else {
          return res.sendStatus(403);
        }
      });
    }
  };
};
