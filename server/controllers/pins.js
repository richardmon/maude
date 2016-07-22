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
     * Adds a comment to a pin
     **/
    addComment: function(req, res){
      var pinId = req.params.pinId;
      var commentId = req.body.commentId;
      Pin.findById(pinId, function(err, pin){
        if(err){
          return res.status(404).json(err);
        }
        if(!pin){
          return res.sendStatus(404);
        }

        Comment.findById(commentId, function(err, comment){
          if(err || !comment){
            return res.sendStatus(400);
          }
          pin.comments.push(commentId);

          pin.save(function(err, pinNewComment){
            if(err){
              return res.status(401).json(err);
            }
            return res.json(pinNewComment);
          });
        })
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
      var Lat = req.query.Lat;
      var Lng = req.query.Lng;

      Pin.find({
        $and: [
          {'location.Lat': Lat},
          {'location.Lng': Lng}
        ]
      }, function(err, pins){
        return res.json(pins);
      });
    }
  };
};
