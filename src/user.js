var config = require('../config.js');

class USER {
  constructor(id) {
    this.id = "";
    this.name = "Anonymous";
    this.isAlive = 1;
    this.dia = defaultUseDia;

    this.x = Math.floor(Math.random() * config.canvas.x);
    this.y = Math.floor(Math.random() * config.canvas.y);
    this.speed = config.defaultSpeed;

    this.kill = 0;
    this.die = 0;
    this.lastSprintTime = 0;
  }

  Move(destination) {
    if (this.x != destination.x) {
      this.x += (destination.x - this.x) * this.speed / 100;
    }
    if (this.y != destination.y) {
      this.y += (destination.y - this.y) * this.speed / 100;
    }
  }

  Sprint() {
    let now = new Date().getTime();
    if ((now - this.lastSprintTime) >= 15000) {
      this.speed += 3;
      setTimeout(function() {
        this.speed = config.defaultSpeed;
      }, 3000);
    } else {
      let coolDownIn = 15000
      console.log('sprint cooling down in ');
    }
  }
}

class GROUP {
  constructor(user1Id, user2Id) {
    this.users = [user1Id, user2Id];
    this.x = Math.floor(Math.random() * config.canvas.x);
    this.y = Math.floor(Math.random() * config.canvas.y);
    this.dia = this.users.length * 20;
    this.power = this.users.length;
  }
}

module.exports = USER;
module.exports = GROUP;
