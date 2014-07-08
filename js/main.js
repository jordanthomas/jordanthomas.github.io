(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    count: 35,
    canvas: document.getElementById('canvas')
  });

  window.addEventListener('resize', function() {
    var canvas = document.getElementById('canvas');

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  });
})();

},{"./particle-field":2}],2:[function(require,module,exports){
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

},{"./particle":3}],3:[function(require,module,exports){
(function() {
  function Particle(options) {
    this.position = options.position;
    this.field = options.field;
    this.radius = Math.round(utils.randomBetween(15, 30));
    this.xVelocity = utils.randomBetween(1, 3) * utils.randomSign();
    this.yVelocity = utils.randomBetween(1, 3) * utils.randomSign();
    this.color = 'rgb(200, 200, 200)';
  }

  Particle.prototype.touchingTop = function() {
    return this.top() <= 0
  };

  Particle.prototype.touchingBottom = function() {
    return this.bottom() >= window.innerHeight;
  };

  Particle.prototype.touchingLeft = function() {
    return this.left() <= 0;
  };

  Particle.prototype.touchingRight = function() {
    return this.right() >= window.innerWidth;
  };

  Particle.prototype.left = function() {
    return this.position.x - this.radius;
  }

  Particle.prototype.right = function() {
    return this.position.x + this.radius;
  }

  Particle.prototype.top = function() {
    return this.position.y - this.radius;
  }

  Particle.prototype.bottom = function() {
    return this.position.y + this.radius;
  }

  Particle.prototype.ageBy = function(time) {
    // Inverse Y direction if touching top or bottom.
    if (this.touchingTop() || this.touchingBottom()) {
      this.yVelocity = this.yVelocity * -1;
    }

    // Inverse X direction if touching left or right.
    if (this.touchingLeft() || this.touchingRight()) {
      this.xVelocity = this.xVelocity * -1;
    }

    // Push to edge if touching.
    if (this.touchingTop()) {
      this.position.y = 0 + this.radius;
    }

    // Push to edge if touching.
    if (this.touchingBottom()) {
      this.position.y = window.innerHeight - this.radius;
    }

    // Push to edge if touching.
    if (this.touchingLeft()) {
      this.position.x = 0 + this.radius;
    }

    // Push to edge if touching.
    if (this.touchingRight()) {
      this.position.x = window.innerWidth - this.radius;
    }

    this.position.x += this.xVelocity * 0.0625 * time;
    this.position.y += this.yVelocity * 0.0625 * time;
  };

  module.exports = Particle;
})();

},{}]},{},[1])