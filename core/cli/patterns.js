var Stylizer = require('../compiler/stylizer.js'),
    _ = require('lodash');

var Patterns = function() {
  this.run = function() {
    var _stylizer = new Stylizer;

    _.forEach(_stylizer.config().plugins, function(n, key) {
      var settings = {};

      //  if plugin is a folder
      if (key.indexOf('/') >= 0) {
        var plugin = require('../../plugins/' + key);
      } else {
        var plugin = require('../../plugins/' + key);
      }
      if (n) {
        settings = n;
      }

      _stylizer.register(key, plugin, settings);
    });

    _stylizer.getPatterns(function(patterns) {

      _.forEach(patterns, function(pattern, key) {

        // Compile patterns
        _stylizer.compile(pattern.template, _stylizer.partials, _stylizer.data(pattern.name), function(compiled) {
          pattern.compiled = compiled;

          // Compile header
          _stylizer.compile(pattern.header, '', _stylizer.data(), function(compiled) {
            pattern.header = compiled;

            // Compile footer
            _stylizer.compile(pattern.footer, '', _stylizer.data(), function(compiled) {
              pattern.footer = compiled;

              var dest = __dirname + '/../../' + _stylizer.config().destination + '/' + pattern.parents.join('/');
              _stylizer.build(dest, pattern.fileName, pattern.header + pattern.compiled + pattern.footer);
            });
          });
        });
      });
    });
  }
}

module.exports = new Patterns;
