'use strict';

module.exports = function(app){
  var Pin = app.models.Pin;
  var Comment = app.models.Comment;
  return {
    /**
     * Creates a new pin
     **/
    create: function(req, res){
      var newPin = new Pin();
      newPin.creator = req.user._id;
      newPin.title = req.body.title;
      newPin.content = req.body.content;

      var locations = (req.body.location ? JSON.parse(req.body.location) : []);
      newPin.location = locations.slice();

      var files = req.files || [];
      files.forEach(file => {
        if (file.fieldname !== 'images') {return;}
        newPin.images.push('uploads/' + file.filename);
      });

      newPin.available = true;


      newPin.save(function(err){
        if (err){
          return res.status(400).json(err);
        }
        return res.json(newPin);
      });
    },

    /**
     * Returns pin information
     **/
    getPin: function(req, res){
      var pinId = req.params.pinId;
      Pin.findById(pinId, function(err, pin){
        if (err){
          return res.sendStatus(404);
        }
        return res.json(pin);
      });
    },

    /**
     * Search for pins matching the query
     **/
    searchPins: function(req, res){
      var lat = req.query.lat;
      var lng = req.query.lng;

      Pin.find({
        $and: [
          {'location.lat': lat},
          {'location.lng': lng}
        ]
      }, function(err, pins){
        return res.json(pins);
      });
    },

    /**
     * Adds a comment to a pin
     **/
    addComment: function(req, res){
      var pinId = req.params.pinId;
      var commentId = req.body.commentId;
      Pin.findById(pinId, function(err, pin){
        if (err){
          return res.status(404).json(err);
        }
        if (!pin){
          return res.sendStatus(404);
        }

        Comment.findById(commentId, function(err, comment){
          if (err || !comment){
            return res.sendStatus(400);
          }

          if (pin.comments.indexOf(commentId) > -1){
            return res.json(pin);
          }

          pin.comments.push(commentId);

          pin.save(function(err, pinNewComment){
            if (err){
              return res.status(401).json(err);
            }
            return res.json(pinNewComment);
          });
        });
      });
    },

    /**
     * Delete a comment from a pin
     **/
    deleteComment: function(req, res){
      var pinId = req.params.pinId;
      var commentId = req.params.commentId;
      Pin.findById(pinId, function(err, pin){
        if (err || !pin){
          return res.sendStatus(404);
        }
        Comment.findById(commentId, function(err, comment){
          if (req.user && req.user._id && comment.creator.equals(req.user._id)){

            pin.comments.pull(comment._id);

            pin.save(function(err, pinDeletedComment){
              if (err || !pinDeletedComment){
                return res.sendStatus(400);
              };
              return res.json(pinDeletedComment);
            });
          } else {
            return res.status(403).json(pin);
          }
        });
      });
    }
  };
};
