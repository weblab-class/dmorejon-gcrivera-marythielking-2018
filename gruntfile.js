module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['gruntfile.js', 'app.js', 'react/**/*.js*'],
      options: {
        'esversion': 6,
      }
    },

    watch: {
      browserify: {
        files: ['react/**/*.js*'],
        tasks: ['browserify']
      }
    },

    browserify: {
      dist: {
        options: {
           transform: [['babelify', {presets: ['es2015', 'react']}]]
        },
        src: ['react/**/*.js*'],
        dest: 'public/js/bundle.js',
      }
    }

  });

  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['jshint', 'browserify']);

};