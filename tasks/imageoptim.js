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

  var q = require('q');
  var path = require('path');
  var exec = require('child_process').exec;
  var taskName = 'imageoptim';
  var issuesPage = 'https://github.com/JamieMason/grunt-imageoptim/issues/new';
  var taskDescription = 'Losslessly compress images from the command line';
  var cliPaths = [
    '../node_modules/imageoptim-cli/bin',
    '../../imageoptim-cli/bin'
  ].map(function(dir) {
    return path.resolve(__dirname, dir);
  });

  (function() {
    var config = grunt.config.data.imageoptim;
    var tasks = config ? [config] : [];
    var hasDeprecatedConfig = false;
    var error = '';

    Object.keys(config).forEach(function(key) {
      var value = config[key];
      var isObject = value && typeof value === 'object';
      var isTask = isObject && key !== 'options' && key !== 'files';
      if (isTask) {
        tasks.push(value);
      }
    });

    hasDeprecatedConfig = tasks.some(function(task) {
      return 'files' in task && task.files.some(function(member) {
        return typeof member === 'string';
      });
    });

    if (hasDeprecatedConfig) {
      error += 'The current grunt-imageoptim configuration format was deprecated to allow us to ';
      error += 'add full support for file pattern matching.\n';
      error += 'In most cases, all this means is renaming the "files" property to "src" but ';
      error += 'updated examples can be found at https://github.com/JamieMason/grunt-imageoptim.';
      grunt.fail.fatal(error);
    }
  }());

  /**
   * Get the ImageOptim-CLI Terminal command to be run for a given directory and task options
   * @param  {String} directory
   * @param  {Object} options
   * @return {String}
   */

  function getCommandByDirectory(directory, options) {
    var command = './imageOptim';
    command += options.quitAfter ? ' --quit' : '';
    command += options.imageAlpha ? ' --image-alpha' : '';
    command += options.jpegMini ? ' --jpeg-mini' : '';
    return command + ' --directory ' + directory.replace(/\s/g, '\\ ');
  }

  /**
   * @param  {String} command
   * @param  {String} cwd
   * @return {Promise}
   */

  function executeDirectoryCommand(command, cwd) {

    var deferred = q.defer();
    var errorMessage = 'ImageOptim-CLI exited with a failure status';
    var imageOptimCli = exec(command, {
      cwd: cwd
    });

    imageOptimCli.stdout.on('data', function(message) {
      console.log((message || '').replace(/\n+$/, ''));
    });

    imageOptimCli.on('exit', function(code) {
      return code === 0 ? deferred.resolve(true) : deferred.reject(new Error(errorMessage));
    });

    return deferred.promise;

  }

  /**
   * @param  {String[]}  files             Array of paths to directories from files: in config.
   * @param  {Boolean}   opts.jpegMini     Whether to run JPEGmini.app.
   * @param  {Boolean}   opts.imageAlpha   Whether to run ImageAlpha.app.
   * @param  {Boolean}   opts.quitAfter    Whether to quit apps after running.
   * @return {Promise}
   */

  function processDirectories(files, opts) {
    return files.map(function(directory) {
      return getCommandByDirectory(directory, opts);
    }).reduce(function(promise, command) {
      return promise.then(function() {
        return executeDirectoryCommand(command, opts.cliPath);
      });
    }, q());
  }

  /**
   * @param  {String} str "hello"
   * @return {String}     "Hello"
   */

  function firstUp(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * @param  {String}  fileType "file" or "Dir"
   * @return {Function}
   */

  function isFileType(fileType) {
    var methodName = 'is' + firstUp(fileType);
    return function(file) {
      return grunt.file[methodName](file);
    };
  }

  /**
   * Ensure the ImageOptim-CLI binary is accessible
   * @return {String}
   */

  function getPathToCli() {
    return cliPaths.filter(function(cliPath) {
      return grunt.file.exists(cliPath);
    })[0];
  }

  grunt.registerMultiTask(taskName, taskDescription, function() {

    var task = this;
    var done = task.async();
    var promise = q();
    var cliPath = getPathToCli();
    var options = task.options({
      jpegMini: false,
      imageAlpha: false,
      quitAfter: false
    });

    if (!cliPath) {
      throw new Error('Unable to locate ImageOptim-CLI. Please raise issue at ' + issuesPage);
    }

    task.files.forEach(function(file) {
      var directories = file.src.filter(isFileType('dir'));
      if (directories.length > 0) {
        promise = promise.then(function() {
          return processDirectories(directories, {
            cliPath: cliPath,
            jpegMini: options.jpegMini,
            imageAlpha: options.imageAlpha,
            quitAfter: options.quitAfter
          });
        });
      }
    });

    promise.done(done);

  });

};
