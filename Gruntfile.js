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
      files: [],
      options: {
        jpegMini: false,
        imageAlpha: false,
        quitAfter: false
      }
    }

  });

  grunt.loadTasks('tasks');

};
