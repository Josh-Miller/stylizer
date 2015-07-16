
var Test = function() {
  var self = {
    extend: 'prePattern',
    init: function(pattern, cb) {
      pattern.footer = 'FOOOTER YAH</body></html>';
      cb(pattern);
    }
  }

  return self;
}

module.exports = Test();
