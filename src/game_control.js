const USER = require('./user.js');
const GROUP = require('./user.js');
const config = require('../config.js');

let users = [];
let groups = [];

for (var i = 0; i < 10; i++) {
  users.push(new USER(i));
}

// groups.push(new GROUP('1', '2'));
// groups.push(new GROUP('5', '6'));

exports = users;
exports = groups;
