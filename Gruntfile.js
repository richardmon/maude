module.exports = function(grunt){

  grunt.initConfig({
    jade: {
      compile: {
	options: {
	  pretty: true,
	},
	files: {
	  "dist/index.html": ["app/**/**.jade"],
	}
      }
    },
    watch:{
      // grunt:{ files: ['Gruntfile.js'] },
      jade:{
	files: ['app/**/*.jade'],
	tasks: ['jade']
      }
    },
    connect: {
      server: {
	options: {
	  livereload: true,
	  base: 'dist/',
	  port: 8000
	}
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('build', 'Convert Jade templates into html templates', ['jade']);
  grunt.registerTask('default', ['jade', 'connect:server','watch']);

}
