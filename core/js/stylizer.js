var _ = require('lodash');

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

ready(function() {
  var iframe = document.getElementById('patterns');
  iframe.src = './patterns/atoms/text/blockquote.html';

  var link = document.querySelectorAll('a');
  _.forEach(link, function(e) {
    e.addEventListener('click', function(e) {
      e.preventDefault();
      iframe.src = './patterns/' + this.getAttribute('href');
      console.log(this.getAttribute('href'));
    });
  });

});
