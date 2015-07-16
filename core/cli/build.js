var Stylizer = require('../compiler/stylizer.js'),
    _ = require('lodash'),
    Pattern = require('../compiler/pattern'),
    fs = require('fs-extra'),
    Files = require('../files');

var Build = function() {

  this.createUri = function(obj, parent) {
    var _build = this;
    var tree = _.map(obj, function(e) {
      e.uri = '/' + e.name;

      if (parent != null) {
        e.uri = parent + '/' + e.name;
      }

      if (e.children != undefined) {
        _build.createUri(e.children, e.uri);
      }
    });
  }

  this.run = function() {

    var tree = Files.dirTree(__dirname + '/../../src/patterns');
    this.createUri(tree.children);

    // Compile footer
    var _stylizer = new Stylizer;
    var pattern = new Pattern;
    var partials = {};

    _.forEach(_stylizer.config().plugins, function(n, key) {
      var plugin = require('../../plugins/stylizer.' + n);

      _stylizer.register(n, plugin);
    });

    pattern.template = fs.readFileSync(__dirname + '/../index.html', 'utf8');
    partials.menu = fs.readFileSync(__dirname + '/../views/partials/menu.hbs', 'utf8');

    _stylizer.compile(pattern.template, partials, {menuTree: tree.children}, function(compiled) {
      _stylizer.build(__dirname + '/../../public', 'index.html', compiled);
    });
  }
}
module.exports = new Build;
