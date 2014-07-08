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
