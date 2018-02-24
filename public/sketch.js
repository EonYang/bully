let socket = io();

function setup(){
  createCanvas(640, 640);

  socket.on('connect', function(){
    console.log("I am connected: " + socket.id);
  });

  socket.on('disconncted', function(){
    socket.emit('disconnected', socket.id);
  });

  socket.on('dataStream', function(){
    console.log('dataStream' + dataStream);
  });
}

function mouseMove(){
  socket.emit('data',function(){
    let pos = {
      x: mouseX,
      y: mouseY
    }
    return pos;
  });
}

function drawPos(pos, dia){
  console.log('dataStream' + dataStream);
  fill(0);
  ellipse(pos.x, pos.y, dia, dia);
}
