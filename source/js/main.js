(function() {
  var ParticleField = require('./particle-field');

  window.utils = {
    randomBetween: function(low, high) {
      return (Math.random() * (high - low)) + low;
    },

    randomSign: function() {
      return Math.round(Math.random()) === 0 ? 1 : -1;
    }
  };

  window.requestAnimationFrame = window.requestAnimationFrame ||
                                 window.mozRequestAnimationFrame ||
                                 window.webkitRequestAnimationFrame ||
                                 window.msRequestAnimationFrame;

  var pf = new ParticleField({
    count: 100,
    canvas: document.getElementById('canvas')
  });

  window.addEventListener('resize', function() {
    var canvas = document.getElementById('canvas');

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  });
})();
