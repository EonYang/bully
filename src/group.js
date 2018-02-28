const config = require('../config.js');
const tool = require('./tool.js');

class GROUP {

  // let b = a.split("");

  constructor(user1, user2) {
    let names = "abcdefghijklmnopqrstuvwxyz";
    this.users = [user1, user2];
    this.x = (user1.x + user2.x) / 2;
    this.y = (user1.y + user2.y) / 2;
    this.r = this.users.length * 20;
    this.power = this.users.length;
    this.name = names.split("")[Math.floor(Math.random() * 25)];
    this.id = tool.CreateId();
    this.isActive = 1;
  }

  AddMember(user3) {
    this.users.push(user3);
  }

  Update(allusers) {

    try {
      let middleX = 0;
      let middleY = 0;
      for (let i = 0; i < this.users.length; i++) {
        let index = tool.FindIndexById(allusers, this.users[i].id);
        middleX += allusers[index].x;
        middleY += allusers[index].y;
      }
      this.x = middleX / this.users.length;
      this.y = middleY / this.users.length;

    } catch (e) {
      console.log('group update occurs a problem again, but who cares!');
    }
    this.r = this.users.length * 20;
    this.power = this.users.length;

  }
}

module.exports = GROUP;
