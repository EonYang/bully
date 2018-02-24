const USER = require('./user.js');
const GROUP = require('./group.js');
const config = require('../config.js');

let users = [];
let groups = [];

for (var i = 0; i < 10; i++) {
  users.push(new USER(i));
}

console.log('Created 10 users');
console.log(users);

let data = {
  users:users,
  groups:groups,
}

groups.push(new GROUP('1', '2'));
groups.push(new GROUP('5', '6'));

module.exports = data;
