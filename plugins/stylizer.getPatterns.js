
var Test = function() {
  var self = {
    extend: 'postPattern',
    init: function(pattern, cb) {
      pattern.footer = 'FOOOTER</body></html>';
      cb(pattern);
    }
  }

  return self;
}

module.exports = Test();
