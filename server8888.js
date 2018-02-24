var USER = require('./src/user.js');
var game = require('./src/game_control.js');
var config = require('./config.js');
let users = require('./src/game_control.js');
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
  // console.log(`An player ${socket.id} connected`);
  users.push(new USER(socket.id));

  //listen to disconnect, if call, delete the user;
  socket.on('disconnect', function() {
    // console.log(`An output client ${socket.id} has disconnected`);
  });
});

function sendData() {
  let data = {
    users:users,
    // groups:groups,
  }
  web.emit('dataStream', data);
}

setInterval(sendData, 33);

function Logs() {
  // console.log(users);
  // console.log(groups);

}

setInterval(Logs, 3000);
