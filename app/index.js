'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var _ = require('lodash');
var fs = require('fs');

_.str = require('underscore.string');
_.mixin(_.str.exports());

var WordpressProjectGenerator = module.exports = function WordpressProjectGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(WordpressProjectGenerator, yeoman.generators.Base);

WordpressProjectGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // have Yeoman greet the user.
  console.log(this.yeoman);

  var prompts = [
    {
      name: 'projectName',
      message: 'What is the full name of your project (i.e. \'Widget Inc Blog\')?'
    },
    {
      name: 'projectSlug',
      message: 'What is the project slug (repository name)?',
      default: function(answers) {
        return _.slugify(answers.projectName);
      },
      filter: function(projectSlug) {
        return _.slugify(projectSlug);
      }
    },
    {
      name: 'themeName',
      message: 'What would you like to name the theme?',
      default: function(answers) {
        return answers.projectName;
      }
    }
  ];

  this.prompt(prompts, function (props) {
    this.projectName = props.projectName;
    this.projectSlug = props.projectSlug;
    this.themeName = props.themeName;
    cb();
  }.bind(this));
};

WordpressProjectGenerator.prototype.app = function app() {
  var themeSlug = _.slugify(this.themeName),
      appDir = this.projectSlug;
  this.template('_package.json', 'package.json');
  this.template('_gruntfile.js', 'gruntfile.js');
  this.template('_composer.json', 'composer.json');
  this.copy('gitignore', '.gitignore');
  this.copy('index.php', 'index.php');
  this.mkdir('wp-content');

  //setup object-cache symlink
  fs.symlinkSync('wp-content/drop-ins/memcached/object-cache.php', 'wp-content/object-cache.php');

  

  //setup the theme --full setup for now
  this.mkdir('wp-content/themes/' + themeSlug);
  this.mkdir('wp-content/themes/' + themeSlug + '/sass');
  this.mkdir('wp-content/themes/' + themeSlug + '/images');
  this.mkdir('wp-content/themes/' + themeSlug + '/js');

  this.copy('theme/index.php', 'wp-content/themes/' + themeSlug + '/index.php');
  this.copy('theme/config.rb', 'wp-content/themes/' + themeSlug + '/config.rb');
  this.copy('theme/main.js', 'wp-content/themes/' + themeSlug + '/js/main.js');
  this.template('theme/_styles.scss', 'wp-content/themes/' + themeSlug + '/sass/styles.scss');
  this.template('theme/_functions.php', 'wp-content/themes/' + themeSlug + '/functions.php');

};

WordpressProjectGenerator.prototype.projectfiles = function projectfiles() {

  //this.copy('editorconfig', '.editorconfig');
  //this.copy('jshintrc', '.jshintrc');
};
