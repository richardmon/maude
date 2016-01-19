'use strict';

module.exports = function(app){
  return{
    User : require('./users')(app),
    Session: require('./session')(app),
  };
};
