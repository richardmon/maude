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
      newPin.location.Lat = req.body.location.Lat;
      newPin.location.Lng = req.body.location.Lng;
      newPin.available = true;

      newPin.save(function(err){
        if (err){
          return res.status(400).json(err);
        }
        return res.json(newPin);
      });
    },

    getPin: function(req, res){
      var pinId = req.params.pinId;
      Pin.findById(pinId, function(err, pin){
        if (err){
          return res.sendStatus(404);
        }
        return res.json(pin);
      });
    }
  };
};
