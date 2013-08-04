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

  var onTaskComplete;
  var dirsTotal;
  var dirsProcessed;

  /**
   * Extend http://nodejs.org/api/path.html to handle
   * tildes in paths, such as '~/Desktop/directory'
   * @param  {String} route
   * @return {String}
   */
  function resolveTilde(route) {
    if (route.substr(0, 1) === '~') {
      route = process.env.HOME + route.substr(1);
    }
    return require('path').resolve(route);
  }

  /**
   * A logging wrapper mainly to exclude stdout's we're getting which only contain whitespace
   * @param  {String}  message
   * @param  {Boolean} isError
   */
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

  /**
   * Handle stdout from ImageOptim-CLI
   * @param  {Object|Null} error
   * @param  {String} stdout
   */
  function onTerminalOutput(error, stdout) {
    if (error !== null) {
      logMessage(stdout, true);
      onTaskComplete(error);
    } else {
      logMessage(stdout);
    }
  }

  /**
   * Based on the configured options, build up the ImageOptim-CLI Terminal command
   * @param  {Object} options
   * @return {String}
   */
  function createTerminalCommand(options) {
    var command = './imageOptim';
    if (options.quitAfter) { command += ' --quit'; }
    if (options.imageAlpha) { command += ' --image-alpha'; }
    if (options.jpegMini) { command += ' --jpeg-mini'; }
    return command + ' --directory';
  }

  /**
   * Called after we've finished processing each directory
   * @param  {String} code
   */
  function onTerminalExit(code) {
    if (++dirsProcessed === dirsTotal) {
      onTaskComplete(code);
    }
  }

  grunt.registerMultiTask('imageoptim', 'Losslessly compress images from the command line', function() {

    var runTerminal = require('child_process').exec;
    var path = require('path');
    var toAbsolutePath = path.resolve;

    var dirs = this.data instanceof Array ? this.data.map(resolveTilde) : [];

    // locate the ImageOptim-CLI executable we have set as a local npm dependency
    var imageOptimCliPath = toAbsolutePath(__dirname, '../node_modules/imageoptim-cli/bin');

    var options = this.options({
      jpegMini: false,
      imageAlpha: false,
      quitAfter: false
    });

    var terminalCommand = createTerminalCommand(options);

    var tplOnFile = '';

    tplOnFile += 'Psssst! ImageOptim-CLI uses folders. Pass the folder containing "{{fullPath}}" ';
    tplOnFile += 'instead and we should be good to go.';

    onTaskComplete = this.async();
    dirsTotal = dirs.length;
    dirsProcessed = 0;

    // if none of the glob patterns matched anything we've nothing to do
    if (!dirsTotal) {
      grunt.fail.fatal('No valid directories were supplied for processing', 1);
    }

    dirs.forEach(function(fullPath) {

      // a reference to the ImageOptim-CLI process running in the terminal
      var imageOptim;

      // the absolute path with whitespace escaped for the terminal
      var escapedFullPath = fullPath.replace(/\s/g, '\\ ');

      // apply the base ImageOptim-CLI command to this folder
      var execImageOptim = terminalCommand + ' ' + escapedFullPath;

      // update on progress
      grunt.log.writeln('Processing "' + fullPath + '"');

      // quit if the glob pattern matched anything other than folders
      if (!grunt.file.isDir(fullPath)) {
        grunt.fail.fatal(tplOnFile.replace('{{fullPath}}', fullPath), 1);
      }

      // run ImageOptim-CLI with the current working directory set to ImageOptim-CLI's bin folder
      imageOptim = runTerminal(execImageOptim, {
        cwd: imageOptimCliPath
      }, onTerminalOutput);

      // After we've processed the last folder we can quit
      imageOptim.on('exit', onTerminalExit);

    });

  });

};
