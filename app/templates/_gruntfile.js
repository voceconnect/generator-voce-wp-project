/*
 * <%= projectName %>
 * https://github.com/voceconnect/<%= projectSlug %>
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    "imagemin": {
      "theme": {
        "files": [
          {
            "expand": true,
            "cwd": "wp-content/themes/<%= themeSlug %>/",
            "src": "**/*.{png,jpg}",
            "dest": "wp-content/themes/<%= themeSlug %>/"
          }
        ]
      }
    },
    "watch": {
      "images": {
        "files": "wp-content/themes/<%= themeSlug %>/images/**/*.{png,jpg,gif}",
        "tasks": ["imagemin"]
      }
    },
    "build": {
      "production": [ "composer:install:no-dev:optimize-autoloader" ],
      "uat": [ "composer:install:no-dev:optimize-autoloader"],
      "staging": [ "composer:install" ],
      "development": [ "composer:install" ]
    }
  });

  //load the tasks
  grunt.loadNpmTasks('grunt-voce-plugins');

  //set the default task as the development build
  grunt.registerTask('default', ['build:development']);

};