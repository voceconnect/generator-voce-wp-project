/*
 * <%= projectName %>
 * https://github.com/voceconnect/<%= projectSlug %>
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    "jshint": {
      "options": {
        "curly": true,
        "eqeqeq": true,
        "eqnull": true,
        "browser": true,
        "plusplus": true,
        "undef": true,
        "unused": true,
        "trailing": true,
        "globals": {
          "jQuery": true,
          "$": true,
          "ajaxurl": true
        }
      },
      "theme": [
        "wp-content/themes/<%= _.slugify(themeName) %>/js/main.js"
      ],
    },
    "uglify": {
      "theme": {
        "options": {
          "preserveComments": "some"
        },
        "files": {
          "wp-content/themes/<%= _.slugify(themeName) %>/js/main.min.js": [
            "wp-content/themes/<%= _.slugify(themeName) %>/js/main.js"
          ],          
          "wp-content/themes/<%= _.slugify(themeName) %>/js/libs/bootstrap.min.js": [
            "wp-content/themes/<%= _.slugify(themeName) %>/js/libs/bootstrap/*.js"
          ]
        }
      }
    },
    "concat": {
      "bootstrap": {
        "src": [
          "wp-content/themes/<%= _.slugify(themeName) %>/js/libs/bootstrap/*.js"
        ],
        "dest": "wp-content/themes/<%= _.slugify(themeName) %>/js/libs/bootstrap.js"
      }
    },
    "imagemin": {
      "theme": {
        "files": [
          {
            "expand": true,
            "cwd": "wp-content/themes/<%= _.slugify(themeName) %>/images/",
            "src": "**/*.{png,jpg}",
            "dest": "wp-content/themes/<%= _.slugify(themeName) %>/images/"
          }
        ]
      }
    },
    "compass": {
      "options": {
        "config": "wp-content/themes/<%= _.slugify(themeName) %>/config.rb",
        "basePath": "wp-content/themes/<%= _.slugify(themeName) %>/",
        "force": true
      },
      "production": {
        "options": {
          "environment": "production"
        }
      },
      "development": {
        "options": {
          "environment": "development"
        }
      }
    },
    "watch": {
      "scripts": {
        "files": "wp-content/themes/<%= _.slugify(themeName) %>/js/**/*.js",
        "tasks": ["jshint", "concat"]
      },
      "images": {
        "files": "wp-content/themes/<%= _.slugify(themeName) %>/images/**/*.{png,jpg,gif}",
        "tasks": ["imagemin"]
      },
      "composer": {
        "files": "composer.json",
        "tasks": ["composer:update"]
      },
      "styles": {
        "files": "wp-content/themes/<%= _.slugify(themeName) %>/sass/**/*.scss",
        "tasks": ["compass"]
      }
    },
    "build": {
      "production": [ "uglify", "composer:install:no-dev:optimize-autoloader", "compass:production" ],
      "uat": [ "uglify", "composer:install:no-dev:optimize-autoloader", "compass:production" ],
      "staging": [ "concat", "composer:install", "compass:development" ],
      "development": [ "concat", "composer:install", "compass:development" ]
    }
  });

  //load the tasks
  grunt.loadNpmTasks('grunt-voce-plugins');

  //set the default task as the development build
  grunt.registerTask('default', ['build:development']);

};