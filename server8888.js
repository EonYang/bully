var USER = require('./src/user.js');
var GROUP = require('./src/group.js');
var GAME = require('./src/game_control.js');
var config = require('./config.js');
let data = {
  users: [],
  groups: []
};

var express = require('express');
var port = 8888;
var app = express();
var server = require('http').createServer(app).listen(port, function() {
  console.log(`server on ${port}`);
});

var game = new GAME();

var io = require('socket.io').listen(server);

app.use(express.static('public'));

var web = io.of('/');

web.on('connection', function(socket) {
  console.log(`An player ${socket.id} connected`);
  data.users.push(new USER(socket.id));

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
    for (let i = 0; i < data.users.length; i++) {
      if (data.users[i].id === socket.id) {
        data.users.splice(i, 1);
        console.log(`%{data.users[i].id} left game`);
        break;
      }
    }

    // console.log(`An output client ${socket.id} has disconnected`);
  });
});

function sendData() {
  for (let i = 0; i < data.users.length; i++) {
    data.users[i].Update();
  }
  for (let i = 0; i < data.groups.length; i++) {
    data.groups[i].Move(data.users);
  }
  game.CheckHitAndRunCorrespondingFunction(data);
  web.emit('dataStream', data);
}

setInterval(sendData, 33);

function Logs() {
  console.log(data);
}

setInterval(Logs, 3000);

function testData() {
  for (let i = 0; i < 6; i++) {
    data.users.push(new USER(i.toString()));
  }
  console.log('Created 3 users');
  data.groups.push(new GROUP(data.users[1],data.users[2]));
  data.groups.push(new GROUP(data.users[5],data.users[3]));
}

testData();
