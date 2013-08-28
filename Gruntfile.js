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

    imageoptim: {
      files: ['~/Desktop/img'],
      options: {
        jpegMini: true,
        imageAlpha: true,
        quitAfter: true
      }
    }

    // imageoptim: {
    //   someTask: {
    //     files: ['~/Desktop/img'],
    //     options: {
    //       jpegMini: true,
    //       imageAlpha: true,
    //       quitAfter: true
    //     }
    //   },
    //   otherTask: {
    //     files: ['~/Desktop/img'],
    //     options: {
    //       jpegMini: false,
    //       imageAlpha: false,
    //       quitAfter: true
    //     }
    //   }
    // }

  });

  grunt.loadTasks('tasks');

};
