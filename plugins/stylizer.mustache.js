'use strict';

var mustache = require('mustache');

module.exports = function(source, partials, data) {

  var template = mustache.render(source, data, partials);

  return template;
}
