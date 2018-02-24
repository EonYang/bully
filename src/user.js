var config = require('../config.js');

class USER {
  constructor(id) {
    id = "";
    name ="Anonymous";
    isAlive: 1;
    dia = defaultUseDia;

    x = Math.floor(Math.random() * config.canvas.x);
    y = Math.floor(Math.random() * config.canvas.y);
    speed = config.defaultSpeed;

    kill = 0;
    die = 0;
    lastSprint = 0;
  }

  Move(destination) {
    if (this.x != destination.x) {
      this.x += (destination.x - this.x) * this.speed / 100;
    }
    if (this.y != destination.y) {
      this.y += (destination.y - this.y) * this.speed / 100;
    }
  }

  Sprint(){
    let now = new Date().getTime();
    if ((now - this.lastSprint)) {

    }this.speed = 5
    var sprint
  }
}

class GROUP {
  constructor(user1Id, user1Id) {
    users = [user1Id,user1Id];
    x = Math.floor(Math.random() * config.canvas.x);
    y = Math.floor(Math.random() * config.canvas.y);
    dia = this.users.length * 20;
    power = this.users.length;
  }
}
