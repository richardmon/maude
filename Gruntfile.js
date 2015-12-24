module.exports = function(grunt){

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
    // //Concat Files
    // concat: {
    //   javascript: {
	  // dest: 'dist/js/script.js',
	  // src: [
	    // 'client/scripts/**/*.js',
	    // 'client/components/**/*.min.js'
	    // ]
    //   },
    //   css:{
	// dest: 'dist/css/style.css',
	// src: ['client/style/**/*.css',
	      // 'client/components/**/*.min.css']
    //   }
    // },
    // //Minimize javascripts
    // uglify: {
    //   generated: {
	// files: [
	  // {
	    // dest: 'dist/js/script.min.js',
	    // src: [ 'dist/js/script.js' ]
	  // }
	// ]
    //   }
    // },
    // //Minified css
    // cssmin: {
    //   my_target: {
	  // src: 'dist/css/style.css',
	  // dest: 'dist/css/style.min.css'
    //   }
    // },
    // useminPrepare: {
    //   html: 'dist/index.html'
    // },
    // usemin:{
    //   html:['dist/index.html']
    // }
  });

  //Load
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-postcss');
  // grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  // grunt.loadNpmTasks('grunt-css');
  // grunt.loadNpmTasks('grunt-usemin');


  //Tasks
  grunt.registerTask('build', 'Convert Jade templates into html templates', ['jade']);
  grunt.registerTask('default', ['stylus', 'postcss', 'jade', 'connect:server', 'watch']);
  // grunt.registerTask('default', ['jade', 'concat', 'uglify', 'cssmin', 'useminPrepare', 'usemin', 'connect:server','watch']);

}
