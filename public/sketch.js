let socket = io();
let groupsColors= [];
let myColor;
let statsDiv;
let gameCanvas;
let infoDiv;
let canvasPos;
let amIAlive = 1;

function setup(){
  createCanvas(640, 640);
  statsDiv = document.getElementById('game-stats');
  infoDiv = document.getElementById('player-info-container');
  gameCanvas = document.getElementById('defaultCanvas0');

  canvasPos = gameCanvas.getBoundingClientRect();
  infoDiv.style.top = canvasPos.top +'px';
  infoDiv.style.left = parseFloat(canvasPos.right)+15 + 'px';
  console.log(canvasPos.top);

  myColor = color(204, 102, 0);
  socket.on('connect', function(){
    console.log("I am connected: " + socket.id);
  });

  socket.on('disconncted', function(){
    socket.emit('disconnected', socket.id);
  });

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

function windowResized(){
  canvasPos = gameCanvas.getBoundingClientRect();
  infoDiv.style.top = canvasPos.top +'px';
  infoDiv.style.left = parseFloat(canvasPos.right) + 15 + 'px';
}

function mousePressed(){
  if(amIAlive){
    let pos = {
      x: mouseX,
      y: mouseY
    }
    socket.emit('newPosition',pos);
  }else{
    console.log("I am dead, and can't draw stuff :(");
  }
}

function randomColor(){

  return color;
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

function showStats(users){
  statsDiv.innerHTML = "";
  for(user of users){
    statsDiv.innerHTML += "<p>"+user.id+" "+user.name+":  "+user.kill+" </p>"
  }
}
