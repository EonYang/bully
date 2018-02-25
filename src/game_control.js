const USER = require('./user.js');
const GROUP = require('./group.js');
const config = require('../config.js');

class GAME {
  constructor() {}

  CreateGroup(users, groups) {
    for (var i = 0; i < users.length; i++) {
      if (!users[i].inGroup) {
        for (var k = 0; k < users.length; k++) {
          if (i != k && !users[k].inGroup) {
            let a = users[i].x - users[k].x;
            let b = users[i].y - users[k].y;
            let r2 = users[i].r + users[k].r;
            if (Math.sqrt(a * a + b * b) < r2) {
              groups.push(new GROUP(users[i].id, users[k].id));
              users[i].inGroup = 1;
              users[k].inGroup = 1;
              console.log('new Group Formed');
            }
          }
        }
      }
    }
    // if 2 users who are not belong to any group collided, new group formed.
  }

  AddMoreMember() {
    // if a user collided a 2 member group, he will be added to this group;
  }

  Bully() {
    // if a 3-user group hit any user or 2-user group, kill them.
    // emit to someone, you got bullied.
  }

  EvenlyMatched() {
    // 3-3 or 2-2, user will be ramdomly distributed to somewhere on the canvas.
  }

}

module.exports = GAME;
