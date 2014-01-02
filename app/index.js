'use strict';


var util    = require('util');
var path    = require('path');
var yeoman  = require('yeoman-generator');
var _       = require('lodash');
var fs      = require('fs');
var chalk   = require('chalk');
_.str = require('underscore.string');
_.mixin(_.str.exports());

var VoceWPProjectGenerator = module.exports = function VoceWPProjectGenerator(args, options) {
  
  yeoman.generators.Base.apply(this, arguments);

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

};

util.inherits(VoceWPProjectGenerator, yeoman.generators.Base);

VoceWPProjectGenerator.prototype.askFor = function askFor() {
  var cb = this.async();
 
  var welcome = 
    chalk.magenta('\n                       : ') + chalk.yellow('? ') + chalk.magenta(',') +
    chalk.magenta('\n                     ,') + chalk.yellow('I??????') + chalk.magenta('.') +
    chalk.magenta('\n                   ?') + chalk.yellow('.?II???.??') + chalk.magenta(':') +
    chalk.magenta('\n                  ?') + chalk.yellow(':I   ~ ~   :') + chalk.magenta('.') +
    chalk.magenta('\n                  :') + chalk.yellow('.?II???????:~') + chalk.magenta(':') +
    chalk.magenta('\n                 ~:') + chalk.yellow('??????: ?I=??') + chalk.magenta('::') +
    chalk.magenta('\n                 ::') + chalk.yellow('I?.: ...:?.,?,') + chalk.magenta(':') +
    chalk.magenta('\n                ~:') + chalk.yellow('  I    =I:   ?  ') + chalk.magenta('::') +
    chalk.magenta('\n                ::') + chalk.yellow('  ? :I???? II  ') + chalk.magenta('::') +
    chalk.magenta('\n               ?::') + chalk.yellow('  ???????????  ') + chalk.magenta('::') +
    chalk.magenta('\n               ~::') + chalk.yellow('  ??I     I?I  ') + chalk.magenta('::') +
    chalk.magenta('\n               :::               ') + chalk.magenta('::?') +
    chalk.magenta('\n               :::              ') + chalk.magenta(':::=') +
    chalk.magenta('\n        ~      ::::            ') + chalk.magenta(':::::     ,~') +
    chalk.magenta('\n       ::::? ,:::::::        ,::::::~  ,:::?') +
    chalk.magenta('\n      ,::::~=     :::::    :::::~    ?:::::,') +
    chalk.magenta('\n      :::::::::,     ?::::::,?    ,:::::::::') +
    chalk.magenta('\n       ? = ,:::::::::        ::~::::::::~ ?') +
    chalk.magenta('\n              ?,:::::::::::::::::::~') +
    chalk.magenta('\n                   ~::::::::::') +
    chalk.magenta('\n                ::::::::::::::::::') +
    chalk.magenta('\n       ,:::::::::::::       :::::::::::::::=') +
    chalk.magenta('\n      ,::::::::::=              ::::::::::::') +
    chalk.magenta('\n       ::::::?                      ?::::::,') +
    chalk.magenta('\n       =::::                          :::::') +
    chalk.magenta('\n                                         ?') +
    chalk.bold.red('\n\n         "Kneel before your master, fool!"\n\n\n');
  console.log(welcome);

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
      name: 'generateTheme',
      type: 'confirm',
      message: 'Would you like to generate a theme from Skeletor?',
      default: true
    },
    {
      name: 'themeName',
      message: 'What would you like to name the theme?',
      default: function(answers) {
        return answers.projectName;
      },
      when: function(answers) {
        return answers.generateTheme;
      }
    }
  ];

  this.prompt(prompts, function (props) {
    this.projectName = props.projectName;
    this.projectSlug = props.projectSlug;
    this.generateTheme = props.generateTheme;
    if(this.generateTheme) {
      this.themeName = props.themeName;
      this.themeSlug = _.slugify(this.themeName);
      this.themeUnderScored = this.themeSlug.replace(/\-/g, '_');
      this.themeTextDomain = this.themeUnderScored;
    }
    cb();
  }.bind(this));
};

VoceWPProjectGenerator.prototype.setupFiles = function setupFiles() {
  this.template('_package.json', 'package.json');
  this.template('_Gruntfile.js', 'Gruntfile.js');
  this.template('_composer.json', 'composer.json');
  this.copy('gitignore', '.gitignore');
  this.copy('index.php', 'index.php');
  this.mkdir('wp-content');
  //setup object-cache symlink
  fs.symlinkSync('wp-content/drop-ins/memcached/object-cache.php', 'wp-content/object-cache.php');
};

VoceWPProjectGenerator.prototype.fetchTheme = function fetchTheme() {
  if(!this.generateTheme) return;
  var done = this.async(),
      themeArchive = 'https://github.com/voceconnect/skeletor/archive/master.tar.gz';
      themeDir = path.join('tmp', this.themeSlug);

  //download & expand https://github.com/voceconnect/skeletor/archive/master.tar.gz
  this.tarball(themeArchive, themeDir, function(err) {
    if(err) {
      done(err);
    }
    done();
  });

};


VoceWPProjectGenerator.prototype.createTheme = function createTheme() {
  if(!this.generateTheme) return;
  var themeDir = path.join('wp-content/themes/', this.themeSlug);
  var files = this.expandFiles('**/*', { cwd: path.join('tmp', this.themeSlug), dot: true});
  var me = this;
  var ignoreFiles = [
    '.git',
    'LICENSE',
    'README',
    '.gitignores',
    'jshintrc',
    'Gruntfile.js',
    'Gruntfile.coffee',
    'gruntfile.js',
    'gruntfile.coffee'
  ];
  var replacements = [
    {find: /Text Domain: _s/g, replace: 'Text Domain: ' + this.themeTextDomain},
    {find: /'_skeletor'/g, replace: "'" + this.themeTextDomain + "'"},
    {find: /_skeletor-/g, replace: this.themeSlug},
    {find: /_skeletor_/g, replace: this.themeUnderScored + '_'},
    {find: / _skeletor/g, replace: ' ' + this.themeName}
  ];

  files.forEach(function(file) {
    var fileContents;
    var filePath = path.join(themeDir, file);
    var tmpFilePath = path.join('tmp', this.themeSlug, file);
    if(ignoreFiles.indexOf(file) !== -1) {
      return;
    }

    //merge dependencies into project's composer.json
    if(file === 'composer.json') {
      projectComposer = JSON.parse( me.readFileAsString('composer.json') );
      themeComposer = JSON.parse( me.readFileAsString(filePath) );
      _.merge(projectComposer.require, themeComposer.require);
      _.merge(projectComposer['require'], themeComposer['require-dev']);
      me.write('composer.json', JSON.stringify(projectComposer, null, 4));
      return;
    }

    //copy the file and make replacements
    fileContents = me.readFileAsString(tmpFilePath);
    for(var i =0; i < replacements.length; i++) {
      fileContents = fileContents.replace(replacements[i].find, replacements[i].replace);
    }
    me.write(filePath, fileContents);
  }, me);

};

VoceWPProjectGenerator.prototype.cleanupTheme = function cleanupTheme() {
  if(!this.generateTheme) return;
  var exec = require('child_process').exec;
  var done = this.async();

  exec('rm -rf ./tmp', done);
};