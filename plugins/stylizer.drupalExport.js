var handlebars = require('handlebars'),
    _ = require('lodash');

var drupalExport = function() {

  var self = {
    extend: '_export',
    init: function(pattern, cb) {
      if (pattern.name.indexOf('node') >= 0) {
        console.log(pattern.name);
      }
    }
  }

  return self;
}


module.exports = drupalExport();
