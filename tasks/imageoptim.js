/*
 * grunt-imageoptim
 * https://github.com/JamieMason/grunt-imageoptim
 * Copyright © 2013 Jamie Mason, @GotNoSugarBaby,
 * https://github.com/JamieMason
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

module.exports = function(grunt) {

  'use strict';

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
