var cons = require('consolidate')
  , name = 'swig';

var consolidate = function(source, partials, data) {
  cons[name](source, data, function(err, html){
    if (err) throw err;

    console.log(html);
  });
}

module.exports = consolidate;
