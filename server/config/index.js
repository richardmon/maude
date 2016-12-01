'use strict';

var env = {
  development: {
    port: process.env.PORT || 3000,
    db:   process.env.MONGOLAB_URI ||
      process.env.MONGOHQ_URL ||
      'mongodb://localhost/maude',
  },
  test: {
    port: process.env.PORT || 3002,
    db:   process.env.MONGOLAB_URI ||
      process.env.MONGOHQ_URL ||
      'mongodb://localhost/maude-test',
  },
  production: {
    port: process.env.PORT || 80,
    db:   process.env.MONGOLAB_URI ||
      process.env.MONGOHQ_URL ||
      'mongodb://localhost/maude-production',
  },
};
module.exports = env[process.env.NODE_ENV || 'development'];
