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
        blanket_qunit: {
            all: {
                options: {
                    urls: ['test/generic.html?coverage=true&gruntReport'],
                    threshold: 75
                }
            }
        },
	    less: {
            build: {
                options: {
                    paths: ["css"]
                },
                files: {
                    "css/zaxxon.css": "less/zaxxon.less",
                    "css/theme/sandbox.css": "less/theme/sandbox.less"
                }
            }
	    },
	    watch: {
            files: ['src/*.js', 'test/*.js', 'less/*.less'],
            tasks: ['build']
	    }
    });

    grunt.loadNpmTasks('grunt-smash');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-blanket-qunit');

    // Default task(s).
    grunt.registerTask('build', ['smash:build','uglify:build', 'less:build', 'blanket_qunit:all']);

};
