let socket = io();
let myColor;

// for layout - getting divs and div position
let statsDiv;
let gameCanvas;
let infoDiv;
let canvasPos;
let startDiv;

// inputs and btns for emit message
let usernameInput;
let updateNameBtn;
let startBtn;

// game controll
let amIAlive = 1;
let gameStarted = 0;

function setup(){
  createCanvas(640, 640);

  statsDiv = document.getElementById('game-stats');
  infoDiv = document.getElementById('player-info-container');
  gameCanvas = document.getElementById('defaultCanvas0');
  startDiv = document.getElementById('start-screen');

  // initial layout position for start screen
  canvasPos = gameCanvas.getBoundingClientRect();
  infoDiv.style.top = canvasPos.top +'px';
  infoDiv.style.left = parseFloat(canvasPos.right)+15 + 'px';
  startDiv.style.top = parseFloat(canvasPos.top) +'px';
  startDiv.style.left = parseFloat(canvasPos.left) + 'px';

  // get elements and add click events
  startBtn = document.getElementById('gamestart-btn');
  usernameInput = document.getElementById('username');
  updateNameBtn = document.getElementById('username-btn');
  startBtn.addEventListener("click", startGame, false);
  updateNameBtn.addEventListener("click", updateUsername, false);

  myColor = color(204, 102, 0);
  socket.on('connect', function(){
    console.log("I am connected: " + socket.id);
  });

  socket.on('disconncted', function(){
    socket.emit('disconnected', socket.id);
  });

  // Get data from server
  socket.on('dataStream', function(data){
    console.log('dataStream' + data.users);
    let users = data.users;

    drawUsers(users);
    showStats(users);
    // let pos = createVector();
    // for(user of users){
    //   pos.x = user.x;
    //   pos.y = user.y;
    //   drawUsers(user.id, pos, user.r);
    // }
    let groups = data.groups;
    // createDiv("group: "+data.groups);
    drawGroups(groups);
  });
}

function mousePressed(){
  if(gameStarted){
    if(amIAlive){
      let pos = {
        x: mouseX,
        y: mouseY
      }
      socket.emit('newPosition',pos);
    }else{
      console.log("I am dead, and can't draw stuff :(");
    }
  }else{
    console.log("Doing nothing, game ain't started");
  }
}

function drawUsers(users){
  background(255);
  let pos = createVector();
  for(user of users){
    if(user.id == socket.id){
      // fill(255, 0, 255);
      amIAlive = user.isAlive;
      fill(myColor);
    }else{
      fill(0);
    }
    if(user.isAlive){
      ellipse(user.x, user.y, user.r*2, user.r*2);
    }
  }
}

function drawGroups(groups){
  for(group of groups){
    fill(200, 30);
    ellipse(group.x, group.y, group.r*2, group.r*2);
  }
}

function updateUsername(){
  console.log("updateUsername: "+ usernameInput.value);
  socket.emit('username', usernameInput.value);
}

function startGame(){
  console.log("start clicked");
  socket.emit('userClickedStart', '' );
  //remove the start div
  startDiv.remove();
}

function showStats(users){
  statsDiv.innerHTML = "";
  for(user of users){
    statsDiv.innerHTML += "<p>"+user.id+" "+user.name+":  "+user.kill+" </p>"
  }
}

function windowResized(){
  canvasPos = gameCanvas.getBoundingClientRect();
  infoDiv.style.top = canvasPos.top +'px';
  infoDiv.style.left = parseFloat(canvasPos.right) + 15 + 'px';
  startDiv.style.top = parseFloat(canvasPos.top) +'px';
  startDiv.style.left = parseFloat(canvasPos.left) + 'px';
}
