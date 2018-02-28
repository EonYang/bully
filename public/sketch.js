let socket = io();
let myColor;

// for layout - getting divs and div position
let statsDiv;
let gameCanvas;
let infoDiv;
let canvasPos;
let startDiv;
let msgDiv;
let messageDivIdCount = 0;

// inputs and btns for emit message
let usernameInput;
let updateNameBtn;
let startBtn;

// game controll
let amIAlive = 1;
let gameStarted = 0;
let timerSet = 0;
let toast,canvasDiv, timerText, riviveTime, CountDownDiv, CountDownTimeOutFunc;

function setup(){
  CountDownDiv = document.getElementById('CountDownDiv');
  CountDownDiv.style.visibility = "hidden"

  var canvas = createCanvas(640, 640);
  canvas.parent('game-area');
  gameArea = document.getElementById('game-area');
  toast = document.getElementById('toast');
  gameArea.appendChild(toast);

  statsDiv = document.getElementById('game-stats');
  infoDiv = document.getElementById('player-info-container');
  gameCanvas = document.getElementById('defaultCanvas0');
  startDiv = document.getElementById('start-screen');
  msgDiv = document.getElementById('msg-screen');

  // initial layout position for start screen
  canvasPos = gameCanvas.getBoundingClientRect();
  infoDiv.style.top = canvasPos.top +'px';
  infoDiv.style.left = parseFloat(canvasPos.right)+15 + 'px';
  startDiv.style.top = parseFloat(canvasPos.top) +'px';
  startDiv.style.left = parseFloat(canvasPos.left) + 'px';

  msgDiv.style.top = parseFloat(canvasPos.top)+200 +'px';
  msgDiv.style.left = parseFloat(canvasPos.left)+120 +'px';

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
    // console.log('dataStream' + data.users);
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

  socket.on('message', function (message) {
    console.log(message.title);
    console.log(message.body);
    console.log(message.duration);

    ShowToast(message, messageDivIdCount);

    // showMessage(message);
    //timer to dismiss msg
    // setTimeout(msgDismiss, message.duration);
  });
}
function draw(){
  lifeCheck();
  if(mouseIsPressed){
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

}

// function mousePressed(){
//   if(gameStarted){
//     if(amIAlive){
//       let pos = {
//         x: mouseX,
//         y: mouseY
//       }
//       socket.emit('newPosition',pos);
//     }else{
//       console.log("I am dead, and can't draw stuff :(");
//     }
//   }else{
//     console.log("Doing nothing, game ain't started");
//   }
// }

function lifeCheck(){
  if(!amIAlive && !timerSet){
    //wait for 10 seconds to revive
    console.log("I have entered the waiting period");
    timerSet = 1;
    // let waitingMsg = {
    //   title:' You Are Dead',
    //   body: 'Wait for 10 Seconds',
    //   duration: 10000
    // }
    // showMessage(waitingMsg);
    // setTimeout(msgDismiss, waitingMsg.duration);
    setTimeout(userRevive, 10000);
    ReviveCountDown(10);
  }
}
function userRevive(){
  // when a user dies, set a timer for the user rejoin the game
  // once revived, send server that this user is revived
  amIAlive = 1;
  timerSet = 0;
  socket.emit('userRevive');
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
  gameStarted = 1;
  socket.emit('userClickedStart');
  //remove the start div
  startDiv.remove();
}
function showMessage(m){
  //reset msgDiv
  while (msgDiv.hasChildNodes()) {
    msgDiv.removeChild(msgDiv.lastChild);
  }
  // display msg div after reset
  msgDiv.style.display = "block";
  var title = document.createElement('h2');
  title.innerHTML = m.title;
  msgDiv.appendChild(title);
  var body = document.createElement('p');
  body.innerHTML = m.body;
  msgDiv.appendChild(body);
}

function msgDismiss(){
  msgDiv.style.display = "none";
}

function showStats(users){
  statsDiv.innerHTML = "";
  for(user of users){
    statsDiv.innerHTML += "<p>"+user.id+" "+user.name+":  "+user.kill+" </p>"
  }
}

function ShowToast(message, messageDivIdCount) {
  CreateMessageDom(messageDivIdCount, message.title, message.body);
  console.log('dom created');
  setTimeout(function () {
    ClearMessageDom(messageDivIdCount);
    messageDivIdCount += 1;
  }, message.duration);

}

function windowResized(){
  canvasPos = gameCanvas.getBoundingClientRect();
  infoDiv.style.top = canvasPos.top +'px';
  infoDiv.style.left = parseFloat(canvasPos.right) + 15 + 'px';
  startDiv.style.top = parseFloat(canvasPos.top) +'px';
  startDiv.style.left = parseFloat(canvasPos.left) + 'px';
  msgDiv.style.top = parseFloat(canvasPos.top) + parseFloat(canvasPos.top)*0.45 +'px';
  msgDiv.style.left = parseFloat(canvasPos.left) + parseFloat(canvasPos.top)*0.55+'px';
}

function CreateMessageDom(divId, title, body) {
  // let canvasDiv = document.getElementById('defaultCanvas0');
  // let messageMainContainer = document.getElementById('toast');
  let messageDiv = document.createElement('div');
  messageDiv.className = 'messageDivClass';
  messageDiv.id = 'messageDiv'+divId;
  toast.appendChild(messageDiv);


  let messageTitle = document.createElement('h4');
  messageTitle.id = 'message title';
  messageTitle.innerHTML = title;

  let messageBody = document.createElement('h6');
  messageBody.id = 'message body';
  messageBody.innerHTML = body;

  messageDiv.appendChild(messageTitle);
  messageDiv.appendChild(messageBody);
  console.log('child added');
}

function ClearMessageDom(divId) {
  let messageDom = document.getElementsByClassName('messageDivClass');
  messageDom[0].parentNode.removeChild(messageDom[0]);
}

function ReviveCountDown(seconds) {
  CountDownDiv.style.visibility = "visible"
  timerText = document.getElementById('timerText');
  riviveTime = new Date().getTime() + seconds * 1000;

  setInterval(function () {
    let now = new Date().getTime();
    timerText.innerHTML = Math.floor((riviveTime - now)/1000);
  }, 1000);
  setTimeout(function () {
    CountDownDiv.style.visibility = "hidden"
  },seconds * 1000)
}

function ClearMessageDom(divId) {
  let messageDom = document.getElementsByClassName('messageDivClass');
  messageDom[0].parentNode.removeChild(messageDom[0]);
}
