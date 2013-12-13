/*
 * grunt-imageoptim
 * https://github.com/JamieMason/grunt-imageoptim
 * Copyright © 2013 Jamie Mason, @fold_left,
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
  var childProcess = require('child_process');
  var exec = childProcess.exec;
  var spawn = childProcess.spawn;
  var gruntFile = path.resolve();
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
    var config = grunt.config.data.imageoptim || {};
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
      error += '\n';
      error += 'grunt-imageoptim 1.4.0 brought a change to it\'s configuration to bring full ';
      error += 'support for Grunt\'s file pattern matching.';
      error += '\n';
      error += 'In most cases all this means is renaming the "files" property to "src", but ';
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
      console.log(String(message || '').replace(/\n+$/, ''));
    });

    imageOptimCli.on('exit', function(code) {
      return code === 0 ? deferred.resolve(true) : deferred.reject(new Error(errorMessage));
    });

    return deferred.promise;

  }

  /**
   * @param  {String[]}  files             Array of paths to directories from src: in config.
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
   * include necessary command line flags based on the current task's options
   * @param  {Object} opts
   * @return {Array}
   */

  function getCliFlags(opts) {
    var cliOptions = [];
    if (opts.quitAfter) {
      cliOptions.push('--quit');
    }
    if (opts.imageAlpha) {
      cliOptions.push('--image-alpha');
    }
    if (opts.jpegMini) {
      cliOptions.push('--jpeg-mini');
    }
    return cliOptions;
  }

  /**
   * @param  {String[]}  files             Array of paths to files from src: in config.
   * @param  {Boolean}   opts.jpegMini     Whether to run JPEGmini.app.
   * @param  {Boolean}   opts.imageAlpha   Whether to run ImageAlpha.app.
   * @param  {Boolean}   opts.quitAfter    Whether to quit apps after running.
   * @return {Promise}
   */

  function processFiles(files, opts) {

    var imageOptimCli;
    var deferred = q.defer();
    var errorMessage = 'ImageOptim-CLI exited with a failure status';

    imageOptimCli = spawn('./imageOptim', getCliFlags(opts), {
      cwd: opts.cliPath
    });

    imageOptimCli.stdout.on('data', function(message) {
      console.log(String(message || '').replace(/\n+$/, ''));
    });

    imageOptimCli.on('exit', function(code) {
      return code === 0 ? deferred.resolve(true) : deferred.reject(new Error(errorMessage));
    });

    imageOptimCli.stdin.setEncoding('utf8');
    imageOptimCli.stdin.end(files.join('\n') + '\n');

    return deferred.promise;

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

  /**
   * Convert a relative path to an absolute file system path
   * @param  {String} relativePath
   * @return {String}
   */

  function toAbsolute(relativePath) {
    return path.resolve(gruntFile, relativePath);
  }

  /**
   * Given a collection of files to be run in a task, seperate the files from the directories to
   * handle them in their own way.
   * @param  {String} fileType "dir" or "file"
   * @param  {String} cliPath
   * @param  {Object} options
   * @param  {Array} taskFiles
   * @param  {Promise} promise
   * @return {Promise}
   */

  function processBatch(fileType, cliPath, options, taskFiles, promise) {
    var files = taskFiles.filter(isFileType(fileType)).map(toAbsolute);
    var processor = fileType === 'dir' ? processDirectories : processFiles;
    return files.length === 0 ? promise : promise.then(function() {
      return processor(files, {
        cliPath: cliPath,
        jpegMini: options.jpegMini,
        imageAlpha: options.imageAlpha,
        quitAfter: options.quitAfter
      });
    });
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
      promise = processBatch('file', cliPath, options, file.src, promise);
      promise = processBatch('dir', cliPath, options, file.src, promise);
    });

    promise.done(done);

  });

};
