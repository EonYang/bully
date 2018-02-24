var config = require('../config.js');

class GROUP {
  constructor(user1Id, user2Id) {
    this.users = [user1Id, user2Id];
    this.x = Math.floor(Math.random() * config.canvas.x);
    this.y = Math.floor(Math.random() * config.canvas.y);
    this.dia = this.users.length * 20;
    this.power = this.users.length;
  }
}


module.exports = GROUP;
