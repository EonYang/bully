var config = require('../config.js');

class GROUP {

  // let b = a.split("");

  constructor(user1, user2) {
    let names = "abcdefghijklmnopqrstuvwxyz";
    this.users = [user1, user2];
    this.x = Math.floor(Math.random() * config.canvas.x);
    this.y = Math.floor(Math.random() * config.canvas.y);
    this.r = this.users.length * 20;
    this.power = this.users.length;
    this.name = names.split("")[Math.floor(Math.random() * 25)];
  }

  AddMember(user3) {
    this.users.push(user3);
    this.r = this.users.length * 20;
    this.power = this.users.length;
  }

  DeleteMember(user) {
    for (var i = 0; i < this.users.length; i++) {
      if (user.id === this.users[i].id) {
        this.users.splice(i, 1);
        this.r = this.users.length * 20;
        this.power = this.users.length;
      }
    }
  }

  Move(allusers) {
    let middleX = 0;
    let middleY = 0;
    for (let i = 0; i < this.users.length; i++) {
      for (let k = 0; k < allusers.length; k++) {
        if (this.users[i].id === allusers[k].id) {
          middleX += allusers[k].x;
          middleY += allusers[k].y;
        }
      }
    }
    this.x = middleX / this.users.length;
    this.y = middleY / this.users.length;
  }
}

module.exports = GROUP;
