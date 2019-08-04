# grunt-imageoptim

> The companion [Grunt](http://gruntjs.com/) plugin for
> [ImageOptim-CLI](http://jamiemason.github.io/ImageOptim-CLI/), which automates
> batch optimisation of images with [ImageOptim](http://imageoptim.com),
> [ImageAlpha](http://pngmini.com) and
> [JPEGmini for Mac](http://jpegmini.com/mac).

[![NPM version](http://img.shields.io/npm/v/grunt-imageoptim.svg?style=flat-square)](https://www.npmjs.com/package/grunt-imageoptim)
[![NPM downloads](http://img.shields.io/npm/dm/grunt-imageoptim.svg?style=flat-square)](https://www.npmjs.com/package/grunt-imageoptim)
[![Dependency Status](http://img.shields.io/david/JamieMason/grunt-imageoptim.svg?style=flat-square)](https://david-dm.org/JamieMason/grunt-imageoptim)
[![Follow JamieMason on GitHub](https://img.shields.io/github/followers/JamieMason.svg?style=social&label=Follow)](https://github.com/JamieMason)
[![Follow fold_left on Twitter](https://img.shields.io/twitter/follow/fold_left.svg?style=social&label=Follow)](https://twitter.com/fold_left)

## 🌩 Installation

```
npm install grunt-imageoptim --save-dev
```

## 🔗 Dependencies

Since this project automates three Mac Applications, you will need them to be
installed on your machine for us to be able to reach them.

- [ImageOptim](http://imageoptim.com)
- [ImageAlpha](http://pngmini.com)
- [JPEGmini for Mac](https://itunes.apple.com/us/app/jpegmini/id498944723) (App
  Store)

A local copy of [ImageOptim-CLI](http://jamiemason.github.io/ImageOptim-CLI/)
will be installed, you won't need to install that separately.

## ⚖️ Configuration

As with all Grunt plugins, grunt-imageoptim is configured using a Gruntfile.js
in the root of your project.

Grunt provide a short
[walkthrough of a sample Gruntfile](http://gruntjs.com/sample-gruntfile) which
explains how they work, but the general structure is this;

```js
module.exports = function(grunt) {
  grunt.initConfig({
    /* your grunt-imageoptim configuration goes here */
  });
  grunt.loadNpmTasks("grunt-imageoptim");
};
```

### Use defaults

Here we want to optimise two directories using default options.

```js
imageoptim: {
  myTask: {
    src: ["www/images", "css/images"];
  }
}
```

### Override defaults

Here we want to optimise two directories using only ImageAlpha and ImageOptim,
then close them once we're done.

```js
imageoptim: {
  myTask: {
    options: {
      jpegMini: false,
      imageAlpha: true,
      quitAfter: true
    },
    src: ['www/images', 'css/images']
  }
}
```

### Custom options for each task

Here we have a task for a folder of PNGs and another for JPGs. Since we use
ImageAlpha to optimise PNGs but not JPGs and vice versa with JPEGmini, here we
toggle their availability between the two tasks.

```js
imageoptim: {
  myPngs: {
    options: {
      jpegMini: false,
      imageAlpha: true,
      quitAfter: true
    },
    src: ['img/png']
  },
  myJpgs: {
    options: {
      jpegMini: true,
      imageAlpha: false,
      quitAfter: true
    },
    src: ['img/jpg']
  }
}
```

### Option inheritance

This example is equivalent to the _custom options for each task_ example, except
we're setting some base options then overriding those we want to change within
each task.

```js
imageoptim: {
  options: {
    quitAfter: true
  },
  allPngs: {
    options: {
      imageAlpha: true,
      jpegMini: false
    },
    src: ['img/png']
  },
  allJpgs: {
    options: {
      imageAlpha: false,
      jpegMini: true
    },
    src: ['img/jpg']
  }
}
```

## ⚖️ Configuration

All options can be either `true` or `false` and default to `false`.

- `quitAfter` Whether to exit each application after we're finished optimising
  your images.
- `jpegMini` Whether to process your images using a copy of
  [JPEGmini.app](https://itunes.apple.com/us/app/jpegmini/id498944723) installed
  on your Mac.
- `imageAlpha` Whether to process your images using a copy of
  [ImageAlpha.app](http://pngmini.com) installed on your Mac.

## 🙋🏾‍♀️ Getting Help

- Get help with issues by creating a
  [Bug Report](https://github.com/JamieMason/grunt-imageoptim/issues/new?template=bug_report.md).
- Discuss ideas by opening a
  [Feature Request](https://github.com/JamieMason/grunt-imageoptim/issues/new?template=feature_request.md).
