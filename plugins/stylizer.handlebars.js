var handlebars = require('handlebars'),
    _ = require('lodash');

var stylizerHandlebars = function(pattern) {

  var self = {
    extend: 'preCompile',
    init: function(pattern, cb) {
      _.forEach(pattern.partials, function(n, key) {
        handlebars.registerPartial(key, n);
      });
      var template = handlebars.compile(pattern.template);

      cb(template(pattern.data));
    }
  }

  return self;
}


module.exports = stylizerHandlebars();
