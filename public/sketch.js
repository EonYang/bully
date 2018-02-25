let socket = io();
let groupsColors= [];
let myColor;
function setup(){
  createCanvas(640, 640);
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
function draw(){

}
function mouseMoved(){
  console.log("mousedMoved");
  let pos = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('newPosition',pos);
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
      fill(myColor);
    }else{
      fill(0);
    }
    ellipse(user.x, user.y, user.r, user.r);
  }
}

function drawGroups(groups){
  for(group of groups){
    fill(200, 30);
    ellipse(group.x, group.y, group.r, group.r);
  }
}
