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
  var fs = require('fs');
  var stat = q.denodeify(fs.stat);
  var taskName = 'imageoptim';
  var taskDescription = 'Losslessly compress images from the command line';

  function fileExists(filePath) {
    var deferred = q.defer();
    fs.exists(filePath, function(canLocate) {
      if (canLocate) {
        deferred.resolve(true);
      } else {
        deferred.reject(new Error('"' + filePath + '" does not exist'));
      }
    });
    return deferred.promise;
  }

  grunt.registerMultiTask(taskName, taskDescription, function() {

    q({
      done: this.async(),
      commands: [],
      directories: this.data,
      bin: path.resolve(__dirname, '../node_modules/imageoptim-cli/bin'),
      exec: q.denodeify(require('child_process').exec),
      options: this.options({
        jpegMini: false,
        imageAlpha: false,
        quitAfter: false
      })
    })

    .then(function(config) {
      if (!(config.directories instanceof Array)) {
        throw new Error('config.files is not an array');
      }
      return config;
    })

    // convert all paths to absolute.
    // convert paths such as '~/Desktop/directory' which contain tildes.

    .then(function(config) {
      config.directories = config.directories.map(function(route) {
        if (route.substr(0, 1) === '~') {
          route = process.env.HOME + route.substr(1);
        }
        return path.resolve(route);
      });
      return config;
    })

    // ensure all paths resolve properly to a file system entity

    .then(function(config) {
      return q.all(config.directories.map(fileExists))
        .then(function() {
          return config;
        });
    })

    // ensure all paths are directories

    .then(function(config) {
      return q.all(config.directories.map(function(directory) {
        return stat(directory);
      }))
        .then(function(statObjects) {
          statObjects.forEach(function(statObject, i) {
            var error = '';
            if (statObject.isDirectory()) {
              return;
            }
            error += 'Psssst! ImageOptim-CLI uses folders.\n';
            error += 'Pass the folder containing "' + config.directories[i] + '"';
            error += ' instead and we should be good to go.';
            throw new Error(error);
          });
          return config;
        });
    })

    // ensure the ImageOptim-CLI binary is accessible

    .then(function(config) {
      return fileExists(config.bin)
        .then(function() {
          return config;
        })
        .fail(function() {
          var error = '';
          error += 'Unable to locate ImageOptim-CLI in "' + config.bin + '".\n';
          error += 'Please raise issue: https://github.com/JamieMason/grunt-imageoptim/issues/new.';
          throw new Error(error);
        });
    })

    // now we have valid paths to directories, we can construct our terminal commands

    .then(function(config) {
      config.commands = config.directories.map(function(directory) {
        var command = './imageOptim';
        var options = config.options;
        command += options.quitAfter ? ' --quit' : '';
        command += options.imageAlpha ? ' --image-alpha' : '';
        command += options.jpegMini ? ' --jpeg-mini' : '';
        return command + ' --directory ' + directory.replace(/\s/g, '\\ ');
      });
      return config;
    })

    // run our terminal commands

    .then(function(config) {
      return q.all(config.commands.map(function(command) {
        return config.exec(command, {
          cwd: config.bin
        });
      })).then(function() {
        return config;
      });
    })

    // here everything worked out and we can tell Grunt we're done

    .then(function(config) {
      config.done();
    })

    // here something failed, so we let Grunt render our errors to the console

    .done();

  });

};
