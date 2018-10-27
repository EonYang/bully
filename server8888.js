const USER = require('./src/user.js');
const GROUP = require('./src/group.js');
const GAME = require('./src/game_control.js');
const config = require('./config.js');
const tool = require('./src/tool.js');
const ai = require('./src/ai.js');

const express = require('express');
const port = 8888;
const app = express();
app.use(express.static('public'));
const server = require('http').createServer(app).listen(port, function() {
    console.log(`server on ${port}`);
});
const io = require('socket.io').listen(server);

const game = new GAME();

let data = {
    users: [],
    groups: []
};

const web = io.of('/');
web.on('connection', function(socket) {
    console.log(`An player ${socket.id} connected`);
    socket.on('userClickedStart', function() {
        data.users.push(new USER(socket.id));
    });

    socket.on('aiControl', function(code) {
        switch (code) {
            case 'add':
                ai.Generate(data);
                ai.Move(data);
                break;
            case 'stop':
                ai.moving = 0;
                break;
            case 'move':
                ai.moving = 1;
                break;
            case 'delete':
                ai.Delete(data);
                break;
            case 'revive':
                ai.Revive(data);
                break;
        }
    });

    socket.on('username', function(name) {
        if (name != null) {
            let index = tool.FindIndexById(data.users, socket.id);
            data.users[index].name = name;
        }
    });

    socket.on('userRevive', function() {
        game.userToRevive.push(socket.id);
    });

    socket.on('test', function() {
        testData();
    });

    socket.on("newPosition", function(newData) {
        // console.log(newData);
        for (let i = 0; i < data.users.length; i++) {
            if (data.users[i].id === socket.id) {
                data.users[i].destination = {
                    x: tool.Constrain(newData.x, 0, config.canvas.x),
                    y: tool.Constrain(newData.y, 0, config.canvas.y)
                };
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
    ExcuteSendingMessage(game.messagesToSend);
    game.messagesToSend = [];
}

setInterval(sendData, 33);

function Logs() {
    console.log(data);
}

// setInterval(Logs, 3000);

function testAi(number) {
    for (var i = 0; i < number; i++) {
        ai.Generate(data);
    }
    setInterval(function() {
        ai.Move(data);
    }, 300);
}

//testAi(4);

function ExcuteSendingMessage(messages) {
    for (let i = 0; i < messages.length; i++) {
        try {
            io.to(messages[i].id).emit(messages[i].event, messages[i].text);
        } catch (e) {
            console.log(`tried to send message to ${messages[i].id}, but failed`);
        } finally {}
    }
}
