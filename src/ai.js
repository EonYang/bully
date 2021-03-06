const tool = require('./tool.js');
const USER = require('./user.js');
const config = require('../config.js');

class AI {
    constructor() {
        this.ids = [];
        this.moving = true;
    }

    Generate(data) {
        let names = "abcdefghijklmnopqrstuvwxyz";
        let id = tool.CreateId();
        let speed = 0.01;
        let name = names.split("")[Math.floor(Math.random() * 25)];
        this.ids.push(id);
        data.users.push(new USER(id, `bot_${name}`, 0.06));
    }

    Move(data) {
        if (this.moving) {
            for (var i = 0; i < this.ids.length; i++) {
                let botIndex = tool.FindIndexById(data.users, this.ids[i]);
                let changeX = tool.Random(400) - 200;
                let changeY = tool.Random(400) - 200;
                data.users[botIndex].destination = {
                    x: tool.Constrain(data.users[botIndex].x + changeX, 0, config.canvas.x),
                    y: tool.Constrain(data.users[botIndex].y + changeY, 0, config.canvas.x)
                };
            }
        }
    }

    Active() {
        this.moving = true;
    }

    Deactive() {
        this.moving = false;
    }

    Delete(data) {
        for (var i = this.ids.length - 1; i >= 0; i--) {
            let botIndex = tool.FindIndexById(data.users, this.ids[i]);
            data.users[botIndex].isAlive = 0;
            //			data.users.splice(botIndex,1);
        }
    }
    Revive(data) {
        for (var i = 0; i < this.ids.length; i++) {
            let botIndex = tool.FindIndexById(data.users, this.ids[i]);
            data.users[botIndex].Restart();
        }
    }
}

var ai = new AI();

module.exports = ai;
