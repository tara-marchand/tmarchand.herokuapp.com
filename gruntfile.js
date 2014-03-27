module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    "public/stylesheets/styles.css" : "sass/styles.scss"
                }
            }
        },

        watch: {
            source: {
                files: ['sass/**/*.scss'],
                tasks: ['sass'],
                options: {
                    livereload: true, // needed to run LiveReload
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-sass");
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask("default", ["sass"]);
};
