var config = require('../config.js');

class USER {
  constructor(id) {
    this.id = id;
    this.name = "Anonymous";
    this.isAlive = 1;
    this.r = config.defaultUseRadius;

    this.x = Math.floor(Math.random() * config.canvas.x);
    this.y = Math.floor(Math.random() * config.canvas.y);
    this.speed = config.defaultSpeed;

    this.kill = 0;
    this.die = 0;
    this.lastSprintTime = 0;
    this.destination = {
      x: this.x,
      y: this.y
    }
    this.inGroup = 0;
  }

  LeaveGroup() {
    this.inGroup = 0;
  }

  Update() {
    if (this.x != this.destination.x) {
      this.x += (this.destination.x - this.x) * this.speed;
    }
    if (this.y != this.destination.y) {
      this.y += (this.destination.y - this.y) * this.speed;
    }
  }

  Restart() {
    this.x = Math.floor(Math.random() * config.canvas.x);
    this.y = Math.floor(Math.random() * config.canvas.y);
    this.destination = {
      x: this.x,
      y: this.y
    }
    this.inGroup = 0;
    this.isAlive = 1;
  }

  Sprint() {
    let now = new Date().getTime();
    if ((now - this.lastSprintTime) >= 15000) {
      this.speed *= 1.4;
      setTimeout(function() {
        this.speed = config.defaultSpeed;
      }, 3000);
    } else {
      let coolDownIn = 15000
      console.log('sprint cooling down in ');
    }
  }
}

module.exports = USER;
