window.utils = {
  randomBetween: function(low, high) {
    return (Math.random() * (high - low)) + low;
  }
};

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var ParticleField = function(options) {
  this.canvas = options.canvas;
  this.canvas.height = window.innerHeight;
  this.canvas.width = window.innerWidth;
  this.context = this.canvas.getContext('2d');
  this.particles = [];
  this.lastFrame = null;
  this.count = options.count || 100;

  while (this.particles.length < this.count) {
    this.particles.push(new Particle({
      position: {
        x: utils.randomBetween(0, this.canvas.width),
        y: utils.randomBetween(0, this.canvas.height)
      }
    }));
  }

  requestAnimationFrame(this.draw.bind(this));
};

ParticleField.prototype.clearField = function() {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

ParticleField.prototype.drawParticle = function(particle) {
  this.context.beginPath();
  this.context.fillStyle = "rgba(50, 50, 50, 0.5)";
  this.context.arc(particle.position.x, particle.position.y, particle.radius, Math.PI * 2, false);
  this.context.fill();
};

ParticleField.prototype.draw = function(time) {
  var self = this,
      delta = time - (this.lastFrame || time);

  this.clearField();

  this.particles.forEach(function(particle) {
    particle.ageBy(delta);
    self.drawParticle(particle);
  });

  this.lastFrame = time;
  requestAnimationFrame(this.draw.bind(this));
};

var Particle = function(options) {
  this.position = options.position;
  this.radius = utils.randomBetween(4, 8);
  this.age = 0;
  this.amplitude = utils.randomBetween(1, 3);
  this.amplitude = (Math.round(Math.random()) === 1 ? -1 : 1) * this.amplitude;
  this.period = utils.randomBetween(90, 180);
};

Particle.prototype.ageBy = function(time) {
  this.age += time * (Math.random() * 0.05);
  this.position.x += this.amplitude * Math.sin(this.age * Math.PI / this.period);
  this.position.y += this.amplitude * Math.cos(this.age * 0.8 * Math.PI / this.period);
};

var pf = new ParticleField({
  count: 100,
  canvas: document.getElementById('canvas')
});

window.addEventListener('resize', function() {
  var canvas = document.getElementById('canvas');

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});
