const USER = require('./user.js');
const GROUP = require('./group.js');
const config = require('../config.js');

class GAME {
  constructor() {}

  AddMoreMember(user, group) {
    // if a user collided a 2 member group, he will be added to this group;
    let a = user.x - group.x;
    let b = user.y - group.y;
    let r2 = user.r + group.r;
    if (Math.sqrt(a * a + b * b) < r2) {
      group.AddMember(user);
      user.inGroup = 1;
      console.log(`group ${group.name} added a member`);
    }
  }

  Bully3v2(bigGroup, smallGroup, users) {
    let a = bigGroup.x - smallGroup.x;
    let b = bigGroup.y - smallGroup.y;
    let r2 = bigGroup.r + smallGroup.r;
    if (Math.sqrt(a * a + b * b) < r2) {
      for (let g = 0; g < bigGroup.users.length; g++) {
        for (let u = 0; u < users.length; u++) {
          if (users[u].inGroup && users[u].id === bigGroup.users[g].id) {
            users[u].kill += 1;
          }
        }
      }

      for (let g = 0; g < smallGroup.users.length; g++) {
        for (let u = 0; u < users.length; u++) {
          if (users[u].inGroup && users[u].id === smallGroup.users[g].id) {
            users[u].die += 1;
            users[u].isAlive = 0;
          }
        }
      }
      console.log('A group added a member');
    }
  }

  Bully3v1(bigGroup, person, users) {
    let a = bigGroup.x - person.x;
    let b = bigGroup.y - person.y;
    let r2 = bigGroup.r + person.r;
    if (Math.sqrt(a * a + b * b) < r2) {
      for (let g = 0; g < bigGroup.users.length; g++) {
        for (let u = 0; u < users.length; u++) {
          if (users[u].inGroup === 1 && users[u].id === bigGroup.users[g].id) {
            users[u].kill += 1;
          }
        }
      }
      person.die += 1;
      person.isAlive = 0;
    }
  }

  EvenlyMatched(group1, group2, users) {
    // 3-3 or 2-2, user will be ramdomly distributed to somewhere on the canvas.
    let a = group1.x - group2.x;
    let b = group1.y - group2.y;
    let r2 = group1.r + group2.r;
    if (Math.sqrt(a * a + b * b) < r2) {
      for (let g = 0; g < group1.users.length; g++) {
        for (let u = 0; u < users.length; u++) {
          if (users[u].inGroup && users[u].id === group1.users[g].id) {
            users[u].Restart();
          }
        }
      }
      for (let g = 0; g < group2.users.length; g++) {
        for (let u = 0; u < users.length; u++) {
          if (users[u].inGroup && users[u].id === group2.users[g].id) {
            users[u].Restart();
          }
        }
      }
      // console.log(Math.sqrt(a * a + b * b), r2);
    }
  }

  //this function need to be in game loop
  CreateGroup(users, groups) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].isAlive && !users[i].inGroup) {
        for (let k = 0; k < users.length; k++) {
          // if 2 users who are not belong to any group collided, new group formed.
          if (i != k && !users[k].inGroup) {
            let a = users[i].x - users[k].x;
            let b = users[i].y - users[k].y;
            let r2 = users[i].r + users[k].r;
            if (Math.sqrt(a * a + b * b) < r2) {
              groups.push(new GROUP(users[i], users[k]));
              users[i].inGroup = 1;
              users[k].inGroup = 1;
              console.log('new Group Formed');
            }
          }
        }
      }
    }
  }

  //this function need to be in game loop
  UserLeftGroup(users, groups) {
    //fetch a group
    for (let i = 0; i < groups.length; i++) {
      console.log(groups[i].name);
      //fetch a user in this group
      for (let k = 0; k < groups[i].users.length; k++) {
        //find the index of this user in users, by comparing id
        let index = users.map(function(e) {
          return e.id;
        }).indexOf(groups[i].users[k].id);

        // culculate the distance between this user and this group
        let a = users[index].x - groups[i].x;
        let b = users[index].y - groups[i].y;
        let r2 = users[index].r + groups[i].r;
        let dist = Math.sqrt(a * a + b * b);

        // if too far away, do something
        if (dist > r2) {
          //this user is no longer in a group
          users[index].inGroup = 0;

          //this group no longer contain this user
          groups[i].users.splice(k, 1);

          //re culculate some argument of this group
          groups[i].r = groups[i].users.length * 20;
          groups[i].power = groups[i].users.length;
          // done
        }
      }
      // after checking all the users in this group;
      if (groups[i].users.length === 1) {
        let index2 = users.map(function(e) {
          return e.id;
        }).indexOf(groups[i].users[0].id);
        users[index2].inGroup = 0;
        groups.splice[i, 1];
        break;
      }
    }
  }

  //this function need to be in game loop
  UserHitGroup(users, groups) {
    for (let i = 0; i < users.length; i++) {
      if (users[i].isAlive && !users[i].inGroup) {
        for (let k = 0; k < groups.length; k++) {
          if (groups[k].power === 2) {
            this.AddMoreMember(users[i], groups[k]);
          } else {
            this.Bully3v1(groups[k], users[i], users);
          }
        }
      }
    }
  }
  //this function need to be in game loop
  GroupHitGroup(users, groups) {
    for (let i = 0; i < groups.length; i++) {
      for (let k = 0; k < groups.length; k++) {
        if (i != k) {
          if (groups[i].power > groups[k].power) {
            this.Bully3v2(groups[i], groups[k], users);
          } else if (groups[i].power === groups[k].power) {
            this.EvenlyMatched(groups[i], groups[k], users);
            groups.splice[i, 1];
            groups.splice[k, 1];
          }
        }
      }
    }
  }

  CheckHitAndRunCorrespondingFunction(data) {
    let users = data.users;
    let groups = data.groups;
    this.CreateGroup(users, groups);
    this.UserLeftGroup(users, groups);
    this.UserHitGroup(users, groups);
    this.GroupHitGroup(users, groups);
  }
}

module.exports = GAME;
