/*
 * grunt-imageoptim
 * https://github.com/JamieMason/grunt-imageoptim
 *
 * Copyright (c) 2013 Jamie Mason @GotNoSugarBaby
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: {
        src: ['tasks/**/*.js']
      }
    },
    // imageoptim: {
    //   options: {
    //     jpegMini: false,
    //     imageAlpha: false,
    //     quitAfter: false
    //   },
    //   someTask: {
    //     files: [
    //       '/Users/jdog/Desktop/img',
    //       '/Users/jdog/Desktop/img/*.jpg',
    //       '/Users/jdog/Desktop/img/NOT_FOUND.tiff',
    //       '/Users/jdog/Desktop/img/*.png',
    //       '/Users/jdog/Desktop/img/*.gif'
    //     ],
    //     options: {
    //       jpegMini: true,
    //       imageAlpha: true,
    //       quitAfter: true
    //     }
    //   },
    //   otherTask: {
    //     src: [
    //       '/Users/jdog/Desktop/img2'
    //     ],
    //     options: {
    //       jpegMini: false,
    //       imageAlpha: false,
    //       quitAfter: true
    //     }
    //   }
    // }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');

};
