var USER = require('./src/user.js');
var GROUP = require('./src/group.js');
var GAME = require('./src/game_control.js');
var config = require('./config.js');
var express = require('express');
var port = 8888;
var app = express();
app.use(express.static('public'));
var server = require('http').createServer(app).listen(port, function() {
  console.log(`server on ${port}`);
});
var io = require('socket.io').listen(server);

var game = new GAME();

let data = {
  users: [],
  groups: []
};

var web = io.of('/');
web.on('connection', function(socket) {
  console.log(`An player ${socket.id} connected`);
  socket.on('userClickedStart', function () {
    data.users.push(new USER(socket.id));
  })

  socket.on("newPosition", function(newData) {
    // console.log(newData);
    for (let i = 0; i < data.users.length; i++) {
      if (data.users[i].id === socket.id) {
        data.users[i].destination = {
          x: newData.x,
          y: newData.y
        }
        break;
      }
    }
  });

  //listen to disconnect, if call, delete the user;
  socket.on('disconnect', function() {
    game.userToLeaveGame.push(socket.id);
  });
});

function sendData() {
  game.CheckEveryFrame(data);
  game.ExcuteAll(data);
  web.emit('dataStream', data);
  ExcuteSendingMessage(game.messagesToSend)
  game.messagesToSend = [];
}

setInterval(sendData, 33);

function Logs() {
  console.log(data);
}

// setInterval(Logs, 3000);

function testData() {
  for (let i = 0; i < 16; i++) {
    data.users.push(new USER(i.toString()));
  }
  console.log('Created 16 users');
  data.groups.push(new GROUP(data.users[2], data.users[5]))
}

testData();

function ExcuteSendingMessage(messages) {
  for (var i = 0; i < messages.length; i++) {
    try {
      io.to(messages[i].id).emit(messages[i].event, messages[i].text);
    } catch (e) {
      console.log(`tried to send message to ${messages[i].id}, but failed`);
    } finally {}
  }
}
