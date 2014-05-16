(function() {
  var Particle = require('./particle');
  
  function ParticleField(options) {
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
          x: Math.round(utils.randomBetween(0, this.canvas.width)),
          y: Math.round(utils.randomBetween(0, this.canvas.height))
        },
        field: this
      }));
    }

    requestAnimationFrame(this.draw.bind(this));
  }

  ParticleField.prototype.clearField = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  ParticleField.prototype.drawParticle = function(particle) {
    this.context.beginPath();
    this.context.fillStyle = particle.color;
    this.context.arc(particle.position.x, particle.position.y, particle.radius, Math.PI * 2, false);
    this.context.fill();
  };

  ParticleField.prototype.draw = function(time) {
    var self = this,
    delta = time - (this.lastFrame || time);

    this.clearField();

    this.particles.forEach(function(particle1) {
      self.particles.forEach(function(particle2) {
        if (self.isColliding(particle1, particle2)) {
          var deltaX = particle1.position.x - particle2.position.x;
          var deltaY = particle1.position.y - particle2.position.y;
          var angle = Math.atan2(deltaY, deltaX);
          var particle1Dir = Math.atan2(particle1.yDir, particle1.xDir);
          var particle2Dir = Math.atan2(particle2.yDir, particle2.xDir);

          particle1.xDir = Math.cos(particle1Dir - angle);
          particle1.yDir = Math.sin(particle1Dir - angle);
          particle2.xDir = Math.cos(particle2Dir - angle);
          particle2.yDir = Math.sin(particle2Dir - angle);
        }
      });
    });

    this.particles.forEach(function(particle) {
      particle.ageBy(delta);
      self.drawParticle(particle);
    });

    this.particles.forEach(function(particle) {
      particle.collided = false;
    });

    this.lastFrame = time;
    requestAnimationFrame(this.draw.bind(this));
  };

  ParticleField.prototype.isColliding = function(particle1, particle2) {
    if (particle1 === particle2) {
      return false;
    }

    if (particle1.collided || particle2.collided) {
      return false;
    }

    // Multiply manually for speed?
    // http://jsperf.com/pow-or-multiplication
    d = Math.pow(particle2.position.x - particle1.position.x, 2) + Math.pow(particle2.position.y - particle1.position.y, 2);
    r = Math.pow(particle1.radius + particle2.radius, 2);

    return particle1.collided = particle2.collided = d <= r;
  };
  
  module.exports = ParticleField
})();
