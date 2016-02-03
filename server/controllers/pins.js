'use strict';

module.exports = function(app){
  var Pin = app.models.Pin;
  return {
    /**
     * Creates a new pin
     **/
    create: function(req, res){
      var newPin = new Pin();
      newPin.creator = req.user._id;
      newPin.title = req.body.title;
      newPin.content = req.body.content;
      newPin.location = req.body.location.slice();
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
      var Lat = req.query.Lat;
      var Lng = req.query.Lng;

      Pin.find({
        $and: [
          {'location.Lat': Lat},
          {'location.Lng': Lng}
        ]
      }, function(err, pins){
        return res.json({'results': pins});
      });
    }
  };
};
