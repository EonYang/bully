const USER = require('./user.js');
const GROUP = require('./group.js');
const config = require('../config.js');
const tool = require('./tool.js');

class GAME {
  constructor() {
    // *** 1 hit 1
    this.groupToCreate = [
      //obj, {user1, user2}
    ];

    // *** 1 hit 2
    this.groupToAddMember = [
      //obj, {group, user3}
    ]

    // *** 1 hit 3, 2 hit 3
    this.userToDie = [
      //obj, users
    ]

    this.userToAddScore = [
      //obj, users
    ]

    // 2 hit 2, 3 hit 3
    this.groupToExplode = [
      //obj, groups
    ]

    // *** user get fa away from group
    this.userToLeaveGroup = [
      //obj, {group users}
    ]

    // *** member less than 2
    this.groupToDismiss = [
      //obj, group,
    ];
  }

  CreateGroup(user1, user2) {
    this.groupToCreate.push({user1: user1, user2: user2})
  }

  GroupAddMember(group, user) {
    this.groupToAddMember.push({group: group, user: user})
  }

  Bully3v1(group, user) {
    for (var i = 0; i < group.users.length; i++) {
      this.userToAddScore.push(group.users[i]);
    }
    this.userToDie.push(user);
  };

  Bully3v2(group3, group2) {
    for (var i = 0; i < group3.users.length; i++) {
      this.userToAddScore.push(group3.users[i]);
    }
    for (var i = 0; i < group2.users.length; i++) {
      this.userToDie.push(group2.users[i]);
    }
    this.groupToExplode.push(group2);
  };

  EvenlyMatched(groupA, groupB) {
    this.groupToExplode.push(groupA);
    this.groupToExplode.push(groupB);
  };

  MemberLeaveGroup(group, user) {
    this.userToLeaveGroup.push({group: group, user: user});
  };

  DeleteGroup(group) {
    this.groupToDismiss.push(group);
  }

  // CheckEveryFrame
  UserHitsUser(users) {
    for (var i = 0; i < users.length; i++) {
      for (var k = i + 1; k < users.length; k++) {
        // console.log('checking user hit user');
        if (tool.IsHit(users[i], users[k])) {
          console.log('user hits user!');
          if (!users[i].inGroup && !users[k].inGroup) {
            console.log('creating new group');
            this.CreateGroup(users[i], users[k]);
          }
        }
      }
    }
  }
  // CheckEveryFrame
  UserHitsGroup(users, groups) {
    for (var i = 0; i < users.length; i++) {
      if (!users[i].inGroup) {
        for (var k = 0; k < groups.length; k++) {
          // console.log('checking user hit group');
          if (tool.IsHit(users[i], groups[k])) {
            switch (groups[k].power) {
              case 2:
                this.GroupAddMember(groups[k], users[i]);
                break;
              case 3:
                this.Bully3v1(groups[k], users[i]);
                break;
              default:
                console.log("user hits a group, but group power is invalid");
            }
          }
        }
      }
    }
  }
  // CheckEveryFrame
  GroupHitsGroup(groups) {
    for (var i = 0; i < groups.length; i++) {
      for (var k = i; k < groups.length; k++) {
        // console.log('checking group hit group');
        if (i != k && tool.IsHit(groups[i], groups[k])) {
          let powerDiffrence = groups[i].power - groups[k].power;
          switch (powerDiffrence) {
            case 1:
              this.Bully3v2(groups[i], groups[k]);
              break;
            case 0:
              this.EvenlyMatched(groups[i], groups[k]);
              break;
            case - 1:
              this.Bully3v2(groups[k], groups[i]);
              break;
            default:
              console.log("group hits a group, but powerDiffrence is invalid");
          }
        }
      }
    }
  }
  // CheckEveryFrame
  MemberGetsFarAwayFromGroup(groups, users) {
    for (var i = 0; i < groups.length; i++) {
      for (var k = 0; k < groups[i].users.length; k++) {
        let index = tool.FindIndexById(users, groups[i].users[k].id);
        // console.log(index);
        // console.log('checking user away group');
        if (!tool.IsHit(groups[i], users[index])) {
          this.MemberLeaveGroup(groups[i], users[index])
        }
      }
    }
  }
  // CheckEveryFrame
  GroupMemberNotEnough(groups) {
    for (var i = 0; i < groups.length; i++) {
      if (groups[i].users.length < 2) {
        this.DeleteGroup(groups[i]);
      }
    }
  }

  CheckEveryFrame(data) {
    let users = data.users;
    let groups = data.groups;
    this.UserHitsUser(users);
    this.UserHitsGroup(users, groups);
    this.GroupHitsGroup(groups);
    this.MemberGetsFarAwayFromGroup(groups, users);
    this.GroupMemberNotEnough(groups);
  }

  Excute(data) {
    // *** 1 hit 1
    // this.groupToCreate = [
    //obj, {user1, user2}
    // ];

    for (var i = 0; i < this.groupToCreate.length; i++) {
      data.groups.push(new GROUP(this.groupToCreate[i].user1, this.groupToCreate[i].user2));
      let i1 = tool.FindIndexById(data.users, this.groupToCreate[i].user1.id);
      let i2 = tool.FindIndexById(data.users, this.groupToCreate[i].user2.id);
      data.users[i1].inGroup = 1;
      data.users[i2].inGroup = 1;
    }
    this.groupToCreate = [];

    // *** 1 hit 2
    // this.groupToAddMember = [
    //obj, {group, user}
    // ]

    for (var i = 0; i < this.groupToAddMember.length; i++) {
      let iU = tool.FindIndexById(data.users, this.groupToAddMember[i].user.id);
      let iG = tool.FindIndexById(data.groups, this.groupToAddMember[i].group.id);
      data.users[iU].inGroup = 1;
      data.groups[iG].users.push(data.users[iU]);
    }
    this.groupToAddMember = [];

    // *** 1 hit 3, 2 hit 3
    // this.userToDie = [
    //obj, users
    // ]
    for (var i = 0; i < this.userToDie.length; i++) {
      let iU = tool.FindIndexById(data.users, this.userToDie[i].id);
      data.users[iU].isAlive = 0;
      data.users[iU].die += 1;
    }
    this.userToDie = [];

    // this.userToAddScore = [
    //obj, users
    // ]
    for (var i = 0; i < this.userToAddScore.length; i++) {
      let iU = tool.FindIndexById(data.users, this.userToAddScore[i].id);
      data.users[iU].kill += 1;
    }
    this.userToAddScore = [];

    // 2 hit 2, 3 hit 3
    // this.groupToExplode = [
    //obj, groups
    // ]
    for (var i = 0; i < this.groupToExplode.length; i++) {
      for (var k = 0; k < this.groupToExplode[i].users.length; k++) {
        let iU = tool.FindIndexById(data.users, this.groupToExplode[i].users[k].id);
        data.users[iU].Explode();
      }
    }
    this.groupToExplode = [];

    // *** user get fa away from group
    // this.userToLeaveGroup = [
    //obj, {group user}
    // ]
    for (var i = 0; i < this.userToLeaveGroup.length; i++) {
      let iU = tool.FindIndexById(data.users, this.userToLeaveGroup[i].user.id);
      let iG = tool.FindIndexById(data.groups, this.userToLeaveGroup[i].group.id);
      let iUInG = tool.FindIndexById(data.groups[iG].users, this.userToLeaveGroup[i].user.id);
      data.users[iU].inGroup = 0;
      data.groups[iG].users.splice(iUInG, 1);
    }
    this.userToLeaveGroup = [];

    // *** member less than 2
    // this.groupToDismiss = [
    //obj, group,
    // ];
    for (var i = 0; i < this.groupToDismiss.length; i++) {
      let index = tool.FindIndexById(data.groups, this.groupToDismiss[i].id);
      switch (data.groups[index].users.length) {
        case 0:
          data.groups.splice(index, 1);
          break;

        case 1:
          let iU = tool.FindIndexById(data.users, data.groups[index].users[0].id);
          data.users[iU].inGroup = 0;
          data.groups.splice(index, 1);
          break;
      }
    }
    this.groupToDismiss = [];
  }

}

module.exports = GAME;
