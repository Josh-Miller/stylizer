"use strict";

var diveSync = require('diveSync'),
    fs = require('fs-extra'),
    handlebars = require('handlebars'),
    readYaml = require('read-yaml'),
    _ = require('lodash'),
    Pattern = require('./pattern'),
    injector = require('./injector');

var paths = {
  plugin: __dirname + '/../../plugins/stylizer.',
}

var Stylizer = function() {

  injector.register('stylizer', this.compile);

  this.config = function() {
    return readYaml.sync(__dirname + '/../../config.yml');
  }
  this.add = function(name, plugin) {
    this.prototype[name] = plugin();
  }
  this.patterns = [];
  this.partials = {};
}

// Stylizer.prototype.compile = function(compileFunctions) {
//   _.foreach(compileFunctions, function(i)) {
//     i();
//   }
// }

Stylizer.prototype.data = function() {
  var data = readYaml.sync(__dirname + '/../../src/data/data.yml');

  return data;
}

Stylizer.prototype.compile = function(source, partials, data) {

  var config = readYaml.sync(__dirname + '/../../config.yml');

  if (!config.compiler) {
    config.compiler = 'handlebars';
  }

  if (!partials) {
    partials = {};
  }

  var compiler = require(paths.plugin + config.compiler);

  return compiler(source, partials, data);
};

Stylizer.prototype.getPatterns = function(getPatterns) {
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
  return _stylizer;
};

Stylizer.prototype.buildFiles = function() {
  var _stylizer = this;
  _.forEach(_stylizer.patterns, function(n, key) {

    fs.outputFileSync(__dirname + '/../../public/patterns/' + n.type + '/' + n.subType + '/' + n.fileName, n.header + Stylizer.prototype.compile(n.template, _stylizer.partials, _stylizer.data()) + n.footer);

  });
};

Stylizer.prototype.export = function() {

};

module.exports = Stylizer;
