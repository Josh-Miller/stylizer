var _ = require('lodash'),
    readYaml = require('read-yaml'),
    diveSync = require('diveSync');

var patternData = function() {

  var self = {
    extend: 'preData',
    init: function(patternName, cb) {
      var patternData;

      diveSync(__dirname + '/../src/data', function(err, file){

        if(err){
          console.log(err);
          return;
        }
        var fileArray = file.split('/');
        var fileName = _.last(fileArray).split('.')[0];

        if (fileName === patternName) {
          patternData = readYaml.sync(file);
        }
      });
      return patternData;
    }
  }

  return self;
}


module.exports = patternData();
