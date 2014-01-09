module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	qunit: {
	    all: ['test/*.html']
	},
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
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');

    // Default task(s).
    grunt.registerTask('build', ['smash:build','uglify:build', 'less:build', 'qunit:all']);

};
