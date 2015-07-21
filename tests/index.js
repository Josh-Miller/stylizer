var Stylizer = require('../core/compiler/stylizer.js'),
    chai = require('chai');

chai.should();

describe('Stylizer', function () {
  describe('getPatterns', function() {
    it('should get an array of Patterns',function(){
      var _stylizer = new Stylizer;

      _stylizer.getPatterns(function(patterns) {
        patterns.should.be.a('array');
      });
    });
  });

  describe('data', function() {
    it('should get an object of Data',function(){
      var _stylizer = new Stylizer;

      _stylizer.data().should.be.a('object');
    });
  });
});
