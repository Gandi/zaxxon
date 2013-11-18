module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    smash: {
        build: {
            src: 'src/<%= pkg.name %>.js',
            dest: 'build/<%= pkg.name %>.js'
        }
    },
    uglify: {
      options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
          src: 'build/<%= pkg.name %>.js',
          dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    watch: {
        files: ['src/*.js'],
        tasks: ['build']
    }
  });

  grunt.loadNpmTasks('grunt-smash');
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('build', ['smash:build','uglify:build']);

};
