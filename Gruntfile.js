module.exports = function(grunt){

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    //Jade compilation
    jade: {
      compile: {
        options: {
          pretty: true,
        },
        files: {
          'client/index.html': ['client/index.jade'],
        }
      },
      views: {
        options: {
          pretty: true
        },
        files: grunt.file.expandMapping(['**/*.jade'], 'client/views/', {
          cwd: 'client/views/',
          rename: function(destBase, destPath) {
            return destBase + destPath.replace(/\.jade$/, '.html');
          }
        })
      }
    },
    //Look for changes
    watch:{
      jade:{
        files: ['client/**/**.jade'],
        tasks: ['jade'],
        options: {
          livereload: true
        }
      },
      stylus:{
        files: ['client/_styles/*.styl'],
        tasks: ['stylus'],
        options: {
          livereload: true
        }
      },
      configFiles: {
        files: ['Gruntfile.js'],
        options: {
          reload: true
        }
      }
    },
    //Stylus
    stylus: {
      compile: {
        options: {
          compress: false
        },
        files: {
          'client/styles/style.css' : 'client/_styles/*.styl'
        }
      }
    },
  //Server
    connect: {
      client: {
        options: {
          base: 'client/',
          port: 8000
        }
      }
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: ['> 0.5%', 'last 5 versions', 'Firefox > 3', 'ie > 8', 'Opera > 9']}) // add vendor prefixes
        ]
      },
      dist: {
        files: {
          'client/styles/style.css': 'client/styles/style.css'
        }
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      angularCode:{
        files: {
          '.tmp/concat/js/script.js' : ['.tmp/concat/js/script.js']
        },
      },
    },
    copy: {
      dist:{
        files:[
          {expand: true, cwd: 'client/', src: 'index.html', dest: 'dist/', filter: 'isFile'},
          {expand: true, cwd: 'client/', src: 'images/**', dest:'dist/', filter: 'isFile'},
          {expand: true, cwd: 'client/', src: 'views/**.html', dest:'dist/', filter: 'isFile'},
          {expand: true, cwd: 'client/components/components-font-awesome/', src: 'fonts/**', dest:'dist/', filter: 'isFile'},
          {expand: true, cwd: 'client/components/bootstrap/', src: 'fonts/**', dest:'dist/', filter: 'isFile'}
        ]
      }
    },
    useminPrepare: {
      html: 'client/index.html',
      options: {
        dest : 'dist/'
      }
    },
    usemin:{
      html:['client/index.html'],
    },
    eslint: {
      server: {
        src: ['server/**/*.js', 'server.js']
      },
      client: {
        src: ['client/scripts/app.js', 'client/scripts/routes.js', 'client/scripts/{controllers,services}/**.js']
      },
      test: {
        src: ['test/**/**.js']
      }
    },

    // Testing
    mochaTest: {
      testServer: {
        options: {
          reporter: 'spec'
        },
        src: ['test/server/**/*.js',
              'test/server/*.js']
      }
    },
    karma: {
     karma: {
      configFile: 'karma.conf.js',
      singleRun: true
      }
    },
  });


  //Tasks
  grunt.registerTask('default', ['stylus', 'postcss', 'jade', 'watch']);
  grunt.registerTask('test', ['mochaTest', 'karma']);
  grunt.registerTask('test-server', ['mochaTest']);
  grunt.registerTask('test-client', ['karma']);
  grunt.registerTask('client', ['stylus', 'postcss', 'jade', 'connect:client', 'watch']);
  grunt.registerTask('build', ['mochaTest',
                               'karma',
                               'eslint:server',
                               'eslint:client',
                               'eslint:test',
                               'jade', 'stylus',
                               'postcss',
                               'useminPrepare',
                               'concat',
                               'ngAnnotate',
                               'uglify',
                               'cssmin',
                               'usemin',
                               'copy']);

};
