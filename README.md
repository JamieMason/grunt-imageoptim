# grunt-imageoptim

A Grunt task to control [ImageOptim](http://imageoptim.com) and [ImageAlpha](http://pngmini.com) so lossless optimisation of images can be part of your automated build process.

Version 1.4 will soon also bring support for automating [JPEGmini for Mac](http://jpegmini.com/mac).

## Getting Started

This plugin requires [Grunt](http://gruntjs.com/) `~0.4.1` and [ImageOptim-CLI](https://github.com/JamieMason/ImageOptim-CLI) `~0.3.2`.

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
  files: [
    'path/to/img/dir',
    'path/to/some/other/img/dir'
  ],
  options: {
    // also run images through ImageAlpha.app before ImageOptim.app
    imageAlpha: true,
    // quit all apps after optimisation
    quitAfter: true
  }
}
```
