const USER = require('./user.js');
const GROUP = require('./group.js');
const config = require('../config.js');

class GAME {
  constructor() {}

  CreateGroup(users, groups) {
    for (let i = 0; i < users.length; i++) {
      if (!users[i].inGroup) {
        for (let k = 0; k < users.length; k++) {
          // if 2 users who are not belong to any group collided, new group formed.
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
  }

  UserHitGroup(users, groups) {
    for (let i = 0; i < users.length; i++) {
      if (!users[i].inGroup) {
        for (let k = 0; k < groups.length; k++) {
          if (groups[k].power === 2) {
            AddMoreMember(users[i], groups[k]);
          } else {
            Bully3v1(groups[k], users[i]);
          }
        }
      }
    }
  }

  GroupHitGroup(groups) {
    for (var i = 0; i < groups.length; i++) {
      for (var k = 0; k < groups.length; k++) {
        if (i != k) {
          if (groups[i].power > group[k].power) {
            Bully3v2(groups[i], groups[k]);
          } else if (groups[i].power === group[k].power) {
            EvenlyMatched(groups[i], groups[k]);
          }
        }
      }
    }
  }

  AddMoreMember(user, group) {
    // if a user collided a 2 member group, he will be added to this group;
    let a = user.x - group.x;
    let b = user.y - group.y;
    let r2 = user.r + group.r;
    if (Math.sqrt(a * a + b * b) < r2) {
      group.AddMember(user.id);
      user.inGroup = 1;
      console.log('A group added a member');
    }
  }

  Bully3v2(bigGroup, smallGroup) {
    let a = bigGroup.x - smallGroup.x;
    let b = bigGroup.y - smallGroup.y;
    let r2 = bigGroup.r + smallGroup.r;
    if (Math.sqrt(a * a + b * b) < r2) {
      for (var i = 0; i < bigGroup.users.length; i++) {
        bigGroup.users[i].kill += 1;
      }
      for (var i = 0; i < smallGroup.users.length; i++) {
        smallGroup.users[i].die += 1;
        smallGroup.users[i].isAlive = 0;
      }
      console.log('A group added a member');
    }
  }

  Bully3v1(bigGroup, person) {
    let a = bigGroup.x - person.x;
    let b = bigGroup.y - person.y;
    let r2 = bigGroup.r + person.r;
    if (Math.sqrt(a * a + b * b) < r2) {
      for (var i = 0; i < bigGroup.users.length; i++) {
        bigGroup.users[i].kill += 1;
      }
      person.die += 1;
      person.isAlive = 0;
    }
  }

  EvenlyMatched(group1, group2) {
    // 3-3 or 2-2, user will be ramdomly distributed to somewhere on the canvas.
    let a = group1.x - group2.x;
    let b = group1.y - group2.y;
    let r2 = group1.r + group2.r;
    if (Math.sqrt(a * a + b * b) < r2) {
      for (var i = 0; i < group1.users.length; i++) {
        group1.users.Restart();
        group2.users.Restart();
      }
      console.log('EvenlyMatched');
    }
  }
}

module.exports = GAME;
