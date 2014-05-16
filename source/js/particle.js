(function() {
  function Particle(options) {
    this.position = options.position;
    this.field = options.field;
    this.radius = Math.round(utils.randomBetween(40, 45));
    this.velocity = 10;
    this.xDir = utils.randomBetween(0.333, 1) * utils.randomSign();
    this.yDir = utils.randomBetween(0.333, 1) * utils.randomSign();
    this.color = "rgba(" + (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ", " + (Math.floor(Math.random() * 255)) + ", 0.5)"
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
    var distance = this.velocity * time * 0.06;

    // Inverse Y direction if touching top or bottom.
    if (this.touchingTop() || this.touchingBottom()) {
      this.yDir = this.yDir * -1;
    }

    // Inverse X direction if touching left or right.
    if (this.touchingLeft() || this.touchingRight()) {
      this.xDir = this.xDir * -1;
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

    this.position.x += Math.round(distance * this.xDir);
    this.position.y += Math.round(distance * this.yDir);
  };
  
  module.exports = Particle;
})();