module.exports = function(grunt) {
  grunt.initConfig({
    imageoptim: {
      imageAssets: {
        options: {
          jpegMini: false,
          imageAlpha: true,
          quitAfter: true
        },
        src: [
          'src/images'
        ]
      }
    }
  });
  grunt.loadNpmTasks('grunt-imageoptim');
};
