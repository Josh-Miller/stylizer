var fs = require('fs'),
    _ = require('lodash'),
    path = require('path');

var Files = function() {
  var self = {
    getDirectories: function(srcpath) {
      return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
      });
    },
    dirTree: function(filename) {

      //ignore _underscored patterns, json (for now), and dotfiles
      var fileLast = _.last(filename.split('/'));

      var stats = fs.lstatSync(filename),
      info = {
        path: filename,
        name: path.basename(filename)
      };

      if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
          return self.dirTree(filename + '/' + child);
        });
      } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
      }

      return info;
    },
    fileContents: function(file) {
      var contents = fs.readFile(file, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }

        return data;
      });

      return contents;
    },
  };

  return self;
}

module.exports = Files();
