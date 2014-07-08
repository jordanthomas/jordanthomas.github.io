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
    this.showFPS = false;
    this.avgFPS = [];

    window.addEventListener('keyup', this.toggleFPS.bind(this), false);

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

  ParticleField.prototype.toggleFPS = function(e) {
    if (e.keyCode === 82) {
      this.showFPS = !this.showFPS;
    }
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

  ParticleField.prototype.drawFPS = function(delta) {
    var fps = Math.round(1000 / delta);
    var total = 0;
    var average = 0;

    while (this.avgFPS.length > 10) {
      this.avgFPS.shift()
    }

    this.avgFPS.push(fps);

    this.avgFPS.forEach(function(val) {
      total += val;
    });

    average = Math.round(total / this.avgFPS.length);

    this.context.fillStyle = "Black";
    this.context.font = "normal 10pt Arial";
    this.context.fillText(average.toString(), 10, 20);
  }

  ParticleField.prototype.draw = function(time) {
    var self = this;
    var delta = time - (this.lastFrame || time);

    this.clearField();

    if (this.showFPS) {
      this.drawFPS(delta);
    }

    this.particles.forEach(function(particle1) {
      self.particles.forEach(function(particle2) {
        if (particle1.collided === false && particle2.collided === false && self.isColliding(particle1, particle2)) {
          self.alignEdges(particle1, particle2);

          var deltaX = particle1.position.x - particle2.position.x;
          var deltaY = particle1.position.y - particle2.position.y;

          var collisionAngle = Math.atan2(deltaY, deltaX);
          var p1Angle = Math.atan2(particle1.yVelocity, particle1.xVelocity);
          var p2Angle = Math.atan2(particle2.yVelocity, particle2.xVelocity);

          var p1Speed = Math.sqrt(particle1.xVelocity * particle1.xVelocity + particle1.yVelocity * particle1.yVelocity);
          var p2Speed = Math.sqrt(particle2.xVelocity * particle2.xVelocity + particle2.yVelocity * particle2.yVelocity);

          var p1xVelocity = p1Speed * Math.cos(p1Angle - collisionAngle);
          var p1yVelocity = p1Speed * Math.sin(p1Angle - collisionAngle);
          var p2xVelocity = p2Speed * Math.cos(p2Angle - collisionAngle);
          var p2yVelocity = p2Speed * Math.sin(p2Angle - collisionAngle);

          var p1xVelocityMass = ((particle1.radius - particle2.radius) * p1xVelocity + (2 * particle2.radius) * p2xVelocity) / (particle1.radius + particle2.radius);
          var p1yVelocityMass = ((particle1.radius - particle2.radius) * p1yVelocity + (2 * particle2.radius) * p2yVelocity) / (particle1.radius + particle2.radius);
          var p2xVelocityMass = ((particle2.radius - particle1.radius) * p2xVelocity + (2 * particle1.radius) * p1xVelocity) / (particle1.radius + particle2.radius);
          var p2yVelocityMass = ((particle2.radius - particle1.radius) * p2xVelocity + (2 * particle1.radius) * p1yVelocity) / (particle1.radius + particle2.radius);

          particle1.xVelocity = Math.cos(collisionAngle) * p1xVelocityMass + Math.cos(collisionAngle + Math.PI / 2) * p1xVelocityMass;
          particle1.yVelocity = Math.sin(collisionAngle) * p1xVelocityMass + Math.sin(collisionAngle + Math.PI / 2) * p1yVelocityMass;
          particle2.xVelocity = Math.cos(collisionAngle) * p2xVelocityMass + Math.cos(collisionAngle + Math.PI / 2) * p2xVelocityMass;
          particle2.yVelocity = Math.sin(collisionAngle) * p2xVelocityMass + Math.sin(collisionAngle + Math.PI / 2) * p2yVelocityMass;
        }
      });
    });

    this.particles.forEach(function(particle) {
      particle.ageBy(delta);
      self.drawParticle(particle);
      particle.collided = false;
    });

    this.lastFrame = time;
    requestAnimationFrame(this.draw.bind(this));
  };

  ParticleField.prototype.alignEdges = function(particle1, particle2) {
    var collision = {
      x: ((particle1.position.x * particle2.radius) + (particle2.position.x * particle1.radius)) / (particle1.radius + particle2.radius),
      y: ((particle1.position.y * particle2.radius) + (particle2.position.y * particle1.radius)) / (particle1.radius + particle2.radius)
    };

    this.nudgeToCollision(collision, particle1);
    this.nudgeToCollision(collision, particle2);
  };

  ParticleField.prototype.nudgeToCollision = function(collision, particle) {
    var deltaX = collision.x - particle.position.x;
    var deltaY = collision.y - particle.position.y;
    var angle  = Math.atan2(deltaY, deltaX);
    var newX   = collision.x + particle.radius * Math.cos(angle - Math.PI);
    var newY   = collision.y + particle.radius * Math.sin(angle - Math.PI);

    particle.position.x = newX;
    particle.position.y = newY;
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
