"use strict";

var diveSync = require('diveSync'),
    fs = require('fs-extra'),
    handlebars = require('handlebars'),
    readYaml = require('read-yaml'),
    _ = require('lodash'),
    Pattern = require('./pattern'),
    events = require('events');

var paths = {
  plugin: __dirname + '/../../plugins/stylizer.',
}

var Stylizer = function() {

  this.config = function() {
    return readYaml.sync(__dirname + '/../../config.yml');
  }

  this.plugins = {};

  this.register = function(n, plugin) {
    this.plugins[plugin.extend] = {plugin: plugin};
  }

  this.on('preCompile', function(pattern) {
    _.forEach(this.plugins, function(n, key) {
      if (n.plugin.extend === 'preCompile') {
        pattern.compiled = n.plugin.init(pattern);
      }
    });
    this.buildPattern(pattern);
  });

  this.patterns = [];
  this.partials = {};
}

Stylizer.prototype.__proto__ = events.EventEmitter.prototype;

Stylizer.prototype.data = function() {
  var data = readYaml.sync(__dirname + '/../../src/data/data.yml');
  this.emit('preData', data);

  return data;
}

Stylizer.prototype.compile = function(template, partials, data, cb) {

  this.emit('preCompile', {template: template, partials: partials, data: data});

};

Stylizer.prototype.getPatterns = function(cb) {
  var _stylizer = this;

  diveSync(__dirname + '/../../src/patterns', function(err, file){

    if(err){
      console.log(err);
      return;
    }

    var rootPath = __dirname + '/../../',
        headerPath = rootPath + _.trim(_stylizer.config().headerPath),
        footerPath = rootPath + _stylizer.config().footerPath;

    var pattern = new Pattern;

    // Pattern header/footer
    var headerTemplate = fs.readFileSync(headerPath, 'utf8');
    var footerTemplate = fs.readFileSync(footerPath, 'utf8');
    pattern.header = Stylizer.prototype.compile(headerTemplate, '', _stylizer.data());
    pattern.footer = Stylizer.prototype.compile(footerTemplate, '', _stylizer.data());
console.log(pattern.header);
    // Naming
    var fileNameArr = file.split('/');
    var fileNames = _.takeRight(fileNameArr, 3);

    pattern.name = _.last(fileNames).split('.')[0];
    pattern.fileName = _.last(fileNames);
    pattern.type = fileNames[0];
    pattern.subType = fileNames[1];

    // Pattern file
    var currentPattern = fs.readFileSync(file, 'utf8');

    // Partials
    _stylizer.partials[_.camelCase(pattern.name)] = currentPattern;

    // Push it
    pattern.template = currentPattern;
    _stylizer.patterns.push(pattern);

  });

  // Build the files
  cb(_stylizer.patterns);
};

Stylizer.prototype.buildPattern = function(pattern) {

  console.log(pattern.compiled);
  fs.outputFileSync(__dirname + '/../../public/patterns/' + pattern.type + '/' + pattern.subType + '/' + pattern.fileName, pattern.header + pattern.compiled + pattern.footer);
};

Stylizer.prototype.export = function() {

};

module.exports = Stylizer;
