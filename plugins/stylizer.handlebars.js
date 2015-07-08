var handlebars = require('handlebars'),
    _ = require('lodash');

module.exports = function(source, partials, data) {
  _.forEach(partials, function(n, key) {
    handlebars.registerPartial(key, n);
  });

  var template = handlebars.compile(source);

  return template(data);
}
