/*
 * grunt-imageoptim
 * https://github.com/JamieMason/grunt-imageoptim
 *
 * Copyright (c) 2013 Jamie Mason @GotNoSugarBaby
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Configuration to be run (and then tested).
    imageoptim: {
      files: [],
      options: {
        jpegMini: false,
        imageAlpha: false,
        quitAfter: false
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Testing Task
  grunt.registerTask('test', ['imageoptim', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
