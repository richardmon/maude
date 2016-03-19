'use strict';

module.exports = function(app){
  return{
    user : require('./users')(app),
    session: require('./session')(app),
    pin: require('./pins')(app),
    profile: require('./profile')(app)
  };
};
