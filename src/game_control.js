const USER = require('./user.js');
const GROUP = require('./group.js');
const config = require('../config.js');
const tool = require('./tool.js');

class GAME {
  constructor() {
    this.userToLeaveGame = [
      //string, userid
    ]

    this.reasons = [
      'putted a turd on you desk, you need some time to cry alone.',
      'robbed your lunch money, you need some time to cry alone.',
      'slapped you, you need some time to cry alone.',
      'gave you a TEXAS CHILI BOWL, you need some time to cry alone.',
      'gave you a nipple twist, you need some time to cry alone.',
      'locked you in your locker, you need some time to cry alone.',
      'said you are UGLY, you need some time to cry alone.',
      'said you never gonna amount to anything.',
      'trolled you on Facebook.',
      'bullied you, but nobody cares.'
    ];

    this.messagesToSend = [
      // {  obj {to who, event, text{title, boddy, duration}}
      //   id: 'placeholder',
      //   event: 'testMessage',
      //   text: {
      //     title: 'test title',
      //     body: `placeholder`,
      //     duration: 1
      //   }
      // }
    ]

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

    // *** user To Revive
    this.userToRevive = [
      //id, userid,
    ];

  }

  GetARandomReason() {
    let index = tool.Random(this.reasons.length);
    return this.reasons[index]
  }

  SendMessage(toId, title, body, duration = 2) {
    let message = {
      id: toId,
      event: 'message',
      text: {
        title: title,
        body: body,
        duration: duration * 1000
      }
    }
    this.messagesToSend.push(message);
  }

  CreateGroup(user1, user2) {
    this.groupToCreate.push({user1: user1, user2: user2})
    this.SendMessage(user1.id, 'You two become a clique', 'Now you can bully person who is alone');
    this.SendMessage(user2.id, 'You two become a clique', 'Now you can bully person who is alone');
  }

  GroupAddMember(group, user) {
    this.groupToAddMember.push({group: group, user: user})
    this.SendMessage(user.id, 'Go Bully Others!', 'You joined a clique, now be a bully!');
    // find the group, tell the two users.
    for (let i = 0; i < group.users.length; i++) {
      this.SendMessage(group.users[i].id, 'Go Bully Others!', 'Someone joined your clique, 3-person clique is the strongest, be a bully!');
    }
  }

  Bully3v1(group, user) {
    let bulliers = [];
    for (let i = 0; i < group.users.length; i++) {
      bulliers.push(group.users[i].name);
      this.userToAddScore.push(group.users[i]);
      this.SendMessage(group.users[i].id, `You bullied ${user.name}!`, `Now he/she probably runs his/her butt home`);
    }
    this.userToDie.push(user);
    this.SendMessage(user.id, `You Got Bullied!`, `${bulliers.toString()} ${this.GetARandomReason()}`, 10);
  };

  Bully3v2(group3, group2) {
    let bulliers = [];
    let victims = [];
    for (let i = 0; i < group2.users.length; i++) {
      victims.push(group2.users[i].name);
    }
    for (let i = 0; i < group3.users.length; i++) {
      bulliers.push(group3.users[i].name);
      this.userToAddScore.push(group3.users[i]);
      this.SendMessage(group3.users[i].id, `You bullied ${victims.toString()}!`, `Now they probably run his/her butt home`);
    }
    for (let i = 0; i < group2.users.length; i++) {
      this.userToDie.push(group2.users[i]);
      this.SendMessage(group2.users[i].id, `You Got Bullied!`, `${bulliers.toString()} ${this.GetARandomReason()}`, 10);
    }
    this.groupToExplode.push(group2);
  };

  EvenlyMatched(groupA, groupB) {

    for (let i = 0; i < groupA.users.length; i++) {
      this.SendMessage(groupA.users[i].id, `Evenly Matched!`, `You all get hurt seriously, wait for your recovery`, 10);
    }
    for (let i = 0; i < groupB.users.length; i++) {
      this.SendMessage(groupB.users[i].id, `Evenly Matched!`, `You all get hurt seriously, wait for your recovery`, 10);
    }
    this.groupToExplode.push(groupA);
    this.groupToExplode.push(groupB);
  };

  MemberLeaveGroup(group, user) {
    let index;
    this.userToLeaveGroup.push({group: group, user: user});
    for (var i = 0; i < this.groupToExplode.length; i++) {
      index = tool.FindIndexById(this.groupToExplode, group.id)
    }
    if (index === -1) {
      this.SendMessage(user.id, 'You left your clique!', 'Be careful');
      // find the group, tell the two users.
      for (let i = 0; i < group.users.length; i++) {
        if (group.users[i].id != user.id) {
          this.SendMessage(group.users[i].id, `${user.name}left your clique`, 'Betrayer! Betrayer! Betrayer! Betrayer! Basterd!');
        }
      }
    }
  };

  DeleteGroup(group) {
    group.isActive = 0;
    this.groupToDismiss.push(group);
    let index;
    for (var i = 0; i < this.groupToExplode.length; i++) {
      index = tool.FindIndexById(this.groupToExplode, group.id)
    }
    if (index === -1) {
      for (let i = 0; i < group.users.length; i++) {
        this.SendMessage(group.users[i].id, `Clique Dismissed.`, 'Whatever.');
      }
    }
  }

  // CheckEveryFrame
  UserHitsUser(users) {
    for (let i = 0; i < users.length; i++) {
      for (let k = i + 1; k < users.length; k++) {
        // console.log('checking user hit user');
        if (users[i].isAlive && users[k].isAlive && tool.IsHit(users[i], users[k])) {
          // console.log('user hits user!');
          if (!users[i].inGroup && !users[k].inGroup) {
            console.log('creating new group');
            users[i].inGroup = 1;
            users[k].inGroup = 1;
            this.CreateGroup(users[i], users[k]);
          }
        }
      }
    }
  }
  // CheckEveryFrame
  UserHitsGroup(users, groups) {
    for (let i = 0; i < users.length; i++) {
      if (!users[i].inGroup & users[i].isAlive) {
        for (let k = 0; k < groups.length; k++) {
          // console.log('checking user hit group');
          if (groups[k].isActive && tool.IsHit(users[i], groups[k])) {
            switch (groups[k].users.length) {
              case 2:
                users[i].inGroup = 1;
                this.GroupAddMember(groups[k], users[i]);
                break;
              case 3:
                this.Bully3v1(groups[k], users[i]);
                users[i].isAlive = 0;
                break;
              case 4:
                this.Bully3v1(groups[k], users[i]);
                users[i].isAlive = 0;
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
    for (let i = 0; i < groups.length; i++) {
      for (let k = i + 1; k < groups.length; k++) {
        // console.log('checking group hit group');
        if (i != k && groups[i].isActive && groups[k].isActive && tool.IsHit(groups[i], groups[k])) {
          let powerDiffrence = groups[i].users.length - groups[k].users.length;
          switch (powerDiffrence) {
            case 1:
              groups[k].isActive = 0;
              this.Bully3v2(groups[i], groups[k]);
              break;
            case 0:
              groups[i].isActive = 0;
              groups[k].isActive = 0;
              this.EvenlyMatched(groups[i], groups[k]);
              break;
            case - 1:
              groups[i].isActive = 0;
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
    for (let i = 0; i < groups.length; i++) {
      for (let k = 0; k < groups[i].users.length; k++) {
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

    for (let i = 0; i < groups.length; i++) {
      let aliveMember = 0;
      for (let k = 0; k < groups[i].users.length; k++) {
        if (groups[i].users[k].isAlive) {
          aliveMember += 1;
        }
      }
      if (aliveMember < 2) {
        this.DeleteGroup(groups[i]);
        aliveMember = 0;
      }
    }
  }

  // *** 1 hit 1
  // this.groupToCreate = [
  //obj, {user1, user2}
  // ];
  ExcuteCreateGroup(data) {
    for (let i = 0; i < this.groupToCreate.length; i++) {
      data.groups.push(new GROUP(this.groupToCreate[i].user1, this.groupToCreate[i].user2));
      let i1 = tool.FindIndexById(data.users, this.groupToCreate[i].user1.id);
      let i2 = tool.FindIndexById(data.users, this.groupToCreate[i].user2.id);
      data.users[i1].inGroup = 1;
      data.users[i2].inGroup = 1;
    }
    this.groupToCreate = [];
  }

  // *** 1 hit 2
  // this.groupToAddMember = [
  //obj, {group, user}
  // ]
  ExcuteGroupAddMember(data) {
    for (let i = 0; i < this.groupToAddMember.length; i++) {
      let iU = tool.FindIndexById(data.users, this.groupToAddMember[i].user.id);
      let iG = tool.FindIndexById(data.groups, this.groupToAddMember[i].group.id);
      data.users[iU].inGroup = 1;
      data.groups[iG].users.push(data.users[iU]);
    }
    this.groupToAddMember = [];
  }

  // *** 1 hit 3, 2 hit 3
  // this.userToDie = [
  //obj, users
  // ]

  ExcuteKillUser(data) {
    for (let i = 0; i < this.userToDie.length; i++) {
      let iU = tool.FindIndexById(data.users, this.userToDie[i].id);
      data.users[iU].isAlive = 0;
      data.users[iU].die += 1;
    }
    this.userToDie = [];
  }

  // this.userToAddScore = [
  //obj, users
  // ]
  ExcuteAddScore(data) {
    for (let i = 0; i < this.userToAddScore.length; i++) {
      let iU = tool.FindIndexById(data.users, this.userToAddScore[i].id);
      data.users[iU].kill += 1;
    }
    this.userToAddScore = [];
  }

  // 2 hit 2, 3 hit 3
  // this.groupToExplode = [
  //obj, groups
  // ]
  ExcuteExplode(data) {
    for (let i = 0; i < this.groupToExplode.length; i++) {
      for (let k = 0; k < this.groupToExplode[i].users.length; k++) {
        let iU = tool.FindIndexById(data.users, this.groupToExplode[i].users[k].id);
        data.users[iU].Explode();
      }
    }
    this.groupToExplode = [];
  }

  // *** user get fa away from group
  // this.userToLeaveGroup = [
  //obj, {group user}
  // ]
  ExcuteLeaveGroup(data) {
    for (let i = 0; i < this.userToLeaveGroup.length; i++) {
      let iU = tool.FindIndexById(data.users, this.userToLeaveGroup[i].user.id);
      let iG = tool.FindIndexById(data.groups, this.userToLeaveGroup[i].group.id);
      let iUInG = tool.FindIndexById(data.groups[iG].users, this.userToLeaveGroup[i].user.id);
      data.users[iU].inGroup = 0;
      data.groups[iG].users.splice(iUInG, 1);
    }
    this.userToLeaveGroup = [];
  }

  ExcuteReviveUser(data) {
    for (let i = 0; i < this.userToRevive.length; i++) {
      let iU = tool.FindIndexById(data.users, this.userToRevive[i]);
      data.users[iU].Restart();
      this.SendMessage(data.users[iU].id, 'You Are Back!', 'Go for you revenge!');
    }
    this.userToRevive = [];
  }

  // *** member less than 2
  // this.groupToDismiss = [
  //obj, group,
  // ];
  ExcuteDismissGroup(data) {
    // console.log(this.groupToDismiss.length);
    for (let i = 0; i < this.groupToDismiss.length; i++) {
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

  ExcuteUserLeftGame(data) {
    for (let i = 0; i < data.groups.length; i++) {
      for (let k = 0; k < data.groups[i].users.length; k++) {
        for (let u = 0; u < this.userToLeaveGame.length; u++) {
          if (data.groups[i].users[k].id === this.userToLeaveGame[u]) {
            console.log(`delete user ${data.groups[i].users[k].id} from group ${data.groups[i].id}`);
            console.log(data.groups[i].users);
            data.groups[i].users.splice(k, 1);
          }
        }
      }
    }
    for (let i = 0; i < this.userToLeaveGame.length; i++) {
      let index = tool.FindIndexById(data.users, this.userToLeaveGame[i]);
      if (index >= 0) {
        data.users.splice(index, 1);
      }
    }
    this.userToLeaveGame = [];
  }

  ExcuteUpdateUserPositions(data) {
    for (let i = 0; i < data.users.length; i++) {
      data.users[i].Update();
    }
    for (let i = 0; i < data.groups.length; i++) {
      data.groups[i].Update(data.users);
    }
  }

  CheckEveryFrame(data) {
    let users = data.users;
    let groups = data.groups;
    this.UserHitsUser(users);
    this.UserHitsGroup(users, groups);
    this.GroupHitsGroup(groups);
    try {
      this.MemberGetsFarAwayFromGroup(groups, users);
    } catch (e) {
      console.log('here occurs a problem again, but who cares!');
    }
    this.GroupMemberNotEnough(groups);
  }

  ExcuteAll(data) {
    this.ExcuteUpdateUserPositions(data);
    this.ExcuteReviveUser(data);
    this.ExcuteCreateGroup(data);
    this.ExcuteGroupAddMember(data);
    this.ExcuteKillUser(data);
    this.ExcuteAddScore(data);
    this.ExcuteExplode(data);
    this.ExcuteLeaveGroup(data);
    this.ExcuteDismissGroup(data);
    this.ExcuteUserLeftGame(data);
  }
}

module.exports = GAME;
