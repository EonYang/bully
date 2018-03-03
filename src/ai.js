const tool = require('./tool.js');
const USER = require('./user.js');
const config = require('../config.js');

class AI {
  constructor() {
    this.ids = [];
    this.moving = true;
  }

  Generate(data) {
    let names = "abcdefghijklmnopqrstuvwxyz";
    let id = tool.CreateId();
    let speed = 0.06;
    let name = names.split("")[Math.floor(Math.random() * 25)];
    this.ids.push(id);
    data.users.push(new USER(id, `bot ${name}`, 0.06));
  }

  Move(data) {
    if (this.moving) {
      for (var i = 0; i < this.ids.length; i++) {
        let botIndex = tool.FindIndexById(data.users, this.ids[i]);
        let changeX = tool.Random(200) - 100;
        let changeY = tool.Random(200) - 100
        data.users[botIndex].destination = {
          x: tool.Constrain(data.users[botIndex].x + changeX, 0, config.canvas.x),
          y: tool.Constrain(data.users[botIndex].y + changeY, 0, config.canvas.x)
        }
      }
    }
  }

  Active() {
    this.moving = true;
  }

  Deactive() {
    this.moving = false;
  }

  Delete(data) {
    for (var i = 0; i < this.ids.length; i++) {
      let botIndex = tool.FindIndexById(data.users, this.ids[i]);
      data.users[botIndex].isAlive = 0;
    }
  }
  Revive(data) {
    for (var i = 0; i < this.ids.length; i++) {
      let botIndex = tool.FindIndexById(data.users, this.ids[i]);
      data.users[botIndex].Restart();
    }
  }
}

var ai = new AI();

module.exports = ai;
