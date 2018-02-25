var config = require('../config.js');

class GROUP {
  constructor(user1Id, user2Id) {
    this.users = [user1Id, user2Id];
    this.x = Math.floor(Math.random() * config.canvas.x);
    this.y = Math.floor(Math.random() * config.canvas.y);
    this.r = this.users.length * 20;
    this.power = this.users.length;
  }

  AddMember(user3Id) {
    this.users.push(user3Id);
    this.r = this.users.length * 20;
    this.power = this.users.length;
  }

  Move(users) {
    let middleX = 0;
    let middleY = 0;
    for (let i = 0; i < this.users.length; i++) {
      for (let k = 0; k < users.length; k++) {
        if (this.users[i].id === users[k].id) {
          middleX += users[k].x;
          middleY += users[k].y;
        }
      }
    }
    this.x = middleX / this.users.length;
    this.y = middleY / this.users.length;
  }
}

module.exports = GROUP;
