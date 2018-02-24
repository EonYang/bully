var USER = require('./src/user.js');
var GROUP = require('./src/group.js');
var game = require('./src/game_control.js');
var config = require('./config.js');
let data = {
  users:[],
  groups:[]
};
// let groups = require('./src/game_control.js');

var express = require('express');
var port = 8888;
var app = express();
var server = require('http').createServer(app).listen(port, function() {
  console.log(`server on ${port}`);
});

var io = require('socket.io').listen(server);

app.use(express.static('public'));

var web = io.of('/');

web.on('connection', function(socket) {
  //listen to player connect, if call, create new user;
  console.log(`An player ${socket.id} connected`);
  data.users.push(new USER(socket.id));

  socket.on("newPosition", function (newData) {
    console.log(newData);
    for (var i = 0; i < data.users.length; i++) {
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
    console.log(`An output client ${socket.id} has disconnected`);
  });
});

function sendData() {
  for (var i = 0; i < data.users.length; i++) {
    data.users[i].Update();
  }
  web.emit('dataStream', data);
}

setInterval(sendData, 33);

function Logs() {
  // console.log(data);
}

// setInterval(Logs, 3000);

function testData() {
  for (var i = 0; i < 3; i++) {
    data.users.push(new USER(i));
  }
  console.log('Created 3 users');

  data.groups.push(new GROUP('1', '2'));
  data.groups.push(new GROUP('5', '6'));
}

testData();
