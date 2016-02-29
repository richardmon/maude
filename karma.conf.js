module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'sinon'],

    files: [
      'client/components/jquery/dist/jquery.min.js',
      'client/components/angular/angular.min.js',
      'client/components/angular-ui-router/release/angular-ui-router.min.js',
      'client/components/angular-resource/angular-resource.min.js',
      'client/components/bootstrap/dist/js/bootstrap.min.js',
      'client/components/angular-mocks/angular-mocks.js',
      'client/components/ng-file-upload/ng-file-upload.min.js',
      'client/scripts/**/*.js',
      'client/scripts/**.js',
      'test/client/**.js',
      'test/client/**/*.js'
    ],
    reporters: ['mocha'],
    browsers: ['PhantomJS']
  });
};
