# grunt-imageoptim

A Grunt task to control [ImageOptim](http://imageoptim.com), [ImageAlpha](http://pngmini.com) and [JPEGmini for Mac](http://jpegmini.com/mac) so lossless optimisation of images can be part of your automated build process.

## Getting Started

This plugin requires [Grunt](http://gruntjs.com/) `~0.4.1` and installs [ImageOptim-CLI](https://github.com/JamieMason/ImageOptim-CLI) `~1.4.1` locally.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-imageoptim --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-imageoptim');
```

## Example Gruntfile

```js
imageoptim: {
  // these paths should match directories
  files: [
    'path/to/img/dir',
    'path/to/some/other/img/dir'
  ],
  options: {
    // also run images through ImageAlpha.app before ImageOptim.app
    imageAlpha: true,
    // also run images through JPEGmini.app after ImageOptim.app
    jpegMini: true,
    // quit all apps after optimisation
    quitAfter: true
  }
}
```
