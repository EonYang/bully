const tool = require('./tool.js');
const USER = require('./user.js');

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
        data.users[botIndex].destination = {
          x: data.users[botIndex].x + tool.Random(200) - 100,
          y: data.users[botIndex].y + tool.Random(200) - 100
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
}

var ai = new AI();

module.exports = ai;
