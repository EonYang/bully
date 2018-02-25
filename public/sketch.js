let socket = io();

function setup(){
  createCanvas(640, 640);

  socket.on('connect', function(){
    console.log("I am connected: " + socket.id);
  });

  socket.on('disconncted', function(){
    socket.emit('disconnected', socket.id);
  });

  socket.on('dataStream', function(data){
    console.log('dataStream' + data.users);
    let users = data.users;
    let pos = createVector();
    for(user of users){
      pos.x = user.x;
      pos.y = user.y;
      drawUsers(user.id, pos, user.r);
    }

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
  // createDiv("socket id:" +socket.id +  "pos "+ pos);
  socket.emit('newPosition',pos);
}

function drawUsers(id, pos, r){
  // background(255);
  if(id == socket.id){
    fill(225);
    // createDiv("socket id:" +socket.id +  "pos "+ pos);
  }else{
    fill(0);
  }

  ellipse(pos.x, pos.y, r, r);
}
