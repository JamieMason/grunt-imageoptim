/*
 * grunt-imageoptim
 * https://github.com/JamieMason/grunt-imageoptim
 *
 * Copyright (c) 2013 Jamie Mason @GotNoSugarBaby
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  function logMessage (message, isError) {

    // quit if message is empty or only contains whitespace
    if (!message || String(message).search(/\S/) === -1) {
      return;
    }

    // remove trailing new lines
    message = message.replace(/\n$/, '');

    if (isError) {
      grunt.fail.fatal(message);
    } else {
      grunt.log.writeln(message);
    }

  }

  grunt.registerMultiTask('imageoptim', 'Losslessly compress images from the command line', function() {

    var terminalCommand;
    var complete = 0;
    var directories = this.filesSrc;
    var done = this.async();
    var exec = require('child_process').exec;
    var options = this.options({
      imageAlpha: false,
      quitAfter: false
    });

    if (options.quitAfter && options.imageAlpha) {
      terminalCommand = 'imageOptim --quit --image-alpha --directory ';
    } else if (!options.quitAfter && options.imageAlpha) {
      terminalCommand = 'imageOptim --image-alpha --directory ';
    } else if (options.quitAfter && !options.imageAlpha) {
      terminalCommand = 'imageOptim --quit --directory ';
    } else {
      terminalCommand = 'imageOptim --directory ';
    }

    if (!directories.length) {
      grunt.fail.fatal('No valid directories were supplied for processing', 1);
    }

    directories.forEach(function(imgPath) {

      var imageOptim;

      grunt.log.writeln('Processing "' + imgPath + '"');

      imageOptim = exec(terminalCommand + imgPath, function(error, stdout) {
        if (error !== null) {
          logMessage(stdout, true);
          done(error);
        } else {
          logMessage(stdout);
        }
      });

      imageOptim.on('exit', function(code) {
        if (++complete === directories.length) {
          done(code);
        }
      });

    });

  });

};
