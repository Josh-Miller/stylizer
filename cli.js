#!/usr/bin/env node

'use strict';

var program = require('commander'),
    _ = require('lodash'),
    Pattern = require('./core/compiler/pattern'),
    fs = require('fs-extra');

program
  .version('0.0.1')
  .option('-b, --build', 'Build app')
  .option('-p, --patterns', 'Compile patterns')
  .parse(process.argv);

var Stylizer = require('./core/compiler/stylizer.js');

function createUri (obj, parent) {
  var tree = _.map(obj, function(e) {
    e.uri = '/' + e.name;

    if (parent != null) {
      e.uri = parent + '/' + e.name;
    }

    if (e.children != undefined) {
      createUri(e.children, e.uri);
    }
  });
}


// Compile patterns
if (program.patterns) {
  var _stylizer = new Stylizer;

  _.forEach(_stylizer.config().plugins, function(n, key) {
    var plugin = require(__dirname + '/plugins/stylizer.' + n);

    _stylizer.register(n, plugin);
  });

  _stylizer.getPatterns(function(patterns) {

    _.forEach(patterns, function(pattern, key) {

      // Compile patterns
      _stylizer.compile(pattern.template, _stylizer.partials, _stylizer.data(), function(compiled) {
        pattern.compiled = compiled;

        // Compile header
        _stylizer.compile(pattern.header, '', _stylizer.data(), function(compiled) {
          pattern.header = compiled;

          // Compile footer
          _stylizer.compile(pattern.footer, '', _stylizer.data(), function(compiled) {
            pattern.footer = compiled;
            _stylizer.buildPattern(pattern);
          });
        });
      });
    });
  });
}


// Build app
if (program.build) {
  var Files = require('./core/files'),
    _ = require('lodash'),
    fs = require('fs');

  var tree = Files.dirTree('./src/patterns');
  createUri(tree.children);

  // Compile footer
  var _stylizer = new Stylizer;
  var pattern = new Pattern;
  var partials = {};

  pattern.template = fs.readFileSync('./core/index.html', 'utf8');
  partials.menu = fs.readFileSync('./core/views/partials/menu.hbs', 'utf8');

  _stylizer.compile(pattern.template, partials, {menuTree: tree.children}, function(compiled) {
    console.log(compiled, 'we made it!!!');
  });
}
