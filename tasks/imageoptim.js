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

    var directories = this.filesSrc;
    var options = this.options({
      imageAlpha: false,
      quitAfter: false
    });
    var done = this.async();
    var exec = require('child_process').exec;
    var complete = 0;

    if (!directories.length) {
      grunt.fail.fatal('No valid directories were supplied for processing', 1);
    }

    directories.forEach(function(dir) {

      var imageOptim;

      grunt.log.writeln('Processing "' + dir + '"');
      
      var imageAlpha = options.imageAlpha ? " -a" : "";
      var quitAfter = options.quitAfter ? " -q" : "";

      imageOptim = exec('imageOptim -d ' + dir + imageAlpha + quitAfter, function(error, stdout, stderr) {
        if (error !== null) {
          done(error);
        }
        if (stdout) {
          console.log(stdout);
        }
        if (stderr) {
          console.log(stderr);
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
