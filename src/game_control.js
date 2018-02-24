const user = require('./user.js');
const config = require('../config.js');

var users = [];
var groups = [];

for (var i = 0; i < 10; i++) {
  users.push(new USER(i));
}

groups.push(new GROUP('1', '2'));
groups.push(new GROUP('5', '6', '7'));

move(destination) {
  if (this.x != mouseX) {
    this.x += (mouseX - this.x) * this.s / 100;
  }
  if (this.y != mouseY) {
    this.y += (mouseY - this.y) * this.s / 100;
  }
}
