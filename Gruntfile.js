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
	  "client/index.html": ["client/index.jade"],
	}
      }
    },
    //Look for changes
    watch:{
      jade:{
	files: ['client/**/**.jade'],
	tasks: ['jade']
      },
      stylus:{
        files: ['client/_styles/*.styl'],
        tasks: ['stylus']
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
      server: {
	options: {
	  livereload: true,
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
          {expand: true, cwd: 'client/components/components-font-awesome/', src: 'fonts/**', dest:'dist/', filter: 'isFile'}
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
    }
  });


  //Tasks
  grunt.registerTask('default', ['stylus', 'postcss', 'jade', 'connect:server', 'watch']);
  grunt.registerTask('build', [ 'jade', 'stylus', 'postcss', 'useminPrepare', 'concat', 'ngAnnotate', 'uglify', 'cssmin', 'usemin', 'copy']);

}
