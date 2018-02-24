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
      drawUsers(user.id, pos, user.dia);
    }
  });
}
function draw(){

}
function mouseMoved(){
  socket.emit('newPosition',function(){
    let pos = {
      x: mouseX,
      y: mouseY
    }
    return pos;
  });
}

function drawUsers(id, pos, dia){
  if(id == socket.id){
    fill(225);
  }else{
    fill(0);
  }
  ellipse(pos.x, pos.y, dia, dia);
}
