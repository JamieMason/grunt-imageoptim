# grunt-imageoptim

The companion [Grunt](http://gruntjs.com/) plugin for [ImageOptim-CLI](http://jamiemason.github.io/ImageOptim-CLI/), which automates batch optimisation of images with [ImageOptim](http://imageoptim.com), [ImageAlpha](http://pngmini.com) and [JPEGmini for Mac](http://jpegmini.com/mac).

## Installation

From the root of your project, run

```shell
npm install grunt-imageoptim --save-dev
```

## Example Gruntfile.js

In future versions we plan to fully support Grunt's file pattern matching. Until then only processing of directories is supported (as opposed to arbitrary collections of files).

```js
module.exports = function(grunt) {
  grunt.initConfig({
    imageoptim: {
      files: ['public/image-directory'],
      options: {
        jpegMini: false,
        imageAlpha: false,
        quitAfter: false
      }
    }
  });
  grunt.loadNpmTasks('grunt-imageoptim');
};
```
