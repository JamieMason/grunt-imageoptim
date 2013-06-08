/*
 * grunt-imageoptim
 * https://github.com/JamieMason/grunt-imageoptim
 *
 * Copyright (c) 2013 Jamie Mason @GotNoSugarBaby
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('imageoptim', 'Losslessly compress images from the command line', function() {

    var complete = 0;
    var directories = this.filesSrc;
    var done = this.async();
    var exec = require('child_process').exec;
    var options = this.options({
      imageAlpha: false,
      quitAfter: false
    });

    // only log stdout if it contains non whitespace characters
    function filterEmptyLog (message) {
      if (message && String(message).search(/\S/) === -1) {
        grunt.log.writeln(message);
      }
    }

    if (!directories.length) {
      grunt.fail.fatal('No valid directories were supplied for processing', 1);
    }

    directories.forEach(function(dir) {

      var command;
      var imageOptim;
      var imageAlpha = options.imageAlpha;
      var quitAfter = options.quitAfter;

      if (quitAfter && imageAlpha) {
        command = 'imageOptim --quit --image-alpha --directory ';
      } else if (!quitAfter && imageAlpha) {
        command = 'imageOptim --image-alpha --directory ';
      } else if (quitAfter && !imageAlpha) {
        command = 'imageOptim --quit --directory ';
      } else {
        command = 'imageOptim --directory ';
      }

      grunt.log.writeln('Processing "' + dir + '"');

      imageOptim = exec(command + dir, function(error, stdout, stderr) {
        if (error !== null) {
          done(error);
        }
        filterEmptyLog(stdout);
        filterEmptyLog(stderr);
      });

      imageOptim.on('exit', function(code) {
        if (++complete === directories.length) {
          done(code);
        }
      });

    });

  });

};
