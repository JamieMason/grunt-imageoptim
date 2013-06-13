/*
 * grunt-imageoptim
 * https://github.com/JamieMason/grunt-imageoptim
 *
 * Copyright (c) 2013 Jamie Mason @GotNoSugarBaby
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  function logMessage(message, isError) {

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

  function getTerminalCommand(options) {

    var command = ['./imageOptim'];

    if (options.quitAfter) {
      command.push('--quit');
    }

    if (options.imageAlpha) {
      command.push('--image-alpha');
    }

    if (options.jpegMini) {
      command.push('--jpeg-mini');
    }

    command.push('--directory');

    return command.join(' ');
  }

  grunt.registerMultiTask('imageoptim', 'Losslessly compress images from the command line', function() {

    var runTerminal = require('child_process').exec;
    var toAbsolutePath = require('path').resolve;
    var onTaskComplete = this.async();

    // locate the ImageOptim-CLI executable we have set as a local npm dependency
    var imageOptimCliPath = toAbsolutePath(__dirname, '../node_modules/imageoptim-cli/bin');

    var options = this.options({
      jpegMini: false,
      imageAlpha: false,
      quitAfter: false
    });

    // based on the options, build up the ImageOptim-CLI Terminal command
    var terminalCommand = getTerminalCommand(options);

    var dirs = this.filesSrc;
    var dirsTotal = dirs.length;
    var dirsProcessed = 0;

    // if none of the glob patterns matched anything we've nothing to do
    if (!dirsTotal) {
      grunt.fail.fatal('No valid directories were supplied for processing', 1);
    }

    dirs.forEach(function(imgPath) {

      // a reference to the ImageOptim-CLI process running in the terminal
      var imageOptim;

      // an absolute path to this folder
      var fullPath = toAbsolutePath(imgPath);

      // the absolute path with whitespace escaped for the terminal
      var escapedFullPath = fullPath.replace(/\s/g, '\\ ');

      // apply the base ImageOptim-CLI command to this folder
      var execCommand = terminalCommand + ' ' + escapedFullPath;

      // update on progress
      grunt.log.writeln('Processing "' + fullPath + '"');

      // quit if the glob pattern matched anything other than folders
      if (!grunt.file.isDir(fullPath)) {
        grunt.fail.fatal('The path "' + fullPath + '" is not a directory', 1);
      }

      // run ImageOptim-CLI with the current working directory set to ImageOptim-CLI's bin folder
      imageOptim = runTerminal(execCommand, {
        cwd: imageOptimCliPath
      }, function(error, stdout) {
        if (error !== null) {
          logMessage(stdout, true);
          onTaskComplete(error);
        } else {
          logMessage(stdout);
        }
      });

      // After we've processed the last folder we can quit
      imageOptim.on('exit', function(code) {
        if (++dirsProcessed === dirsTotal) {
          onTaskComplete(code);
        }
      });

    });

  });

};
